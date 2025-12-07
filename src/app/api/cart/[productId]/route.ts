/**
 * Cart Item API Route
 * 
 * Handles individual cart item operations.
 * 
 * @route PUT /api/cart/[productId] - Update quantity
 * @route DELETE /api/cart/[productId] - Remove item
 */

import { NextRequest, NextResponse } from 'next/server';
import { CartRepository } from '@/repositories';
import { getCurrentUser } from '@/lib/auth';
import { seedDatabase } from '@/lib/db/seed';

// Initialize database on first request
let initialized = false;

async function ensureAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Not authenticated', status: 401 };
  }
  return { user };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const auth = await ensureAuth();
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { productId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid quantity is required'
      }, { status: 400 });
    }

    const success = CartRepository.updateQuantity(
      auth.user.userId,
      parseInt(productId),
      quantity
    );

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update cart item'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cart updated'
    });

  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update cart'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const auth = await ensureAuth();
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { productId } = await params;
    const success = CartRepository.removeItem(auth.user.userId, parseInt(productId));

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Item not found in cart'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart'
    });

  } catch (error) {
    console.error('Cart remove error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove item from cart'
    }, { status: 500 });
  }
}
