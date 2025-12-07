/**
 * Cart API Route
 * 
 * Handles cart operations: get, add, update, delete.
 * 
 * @route GET /api/cart - Get cart
 * @route POST /api/cart - Add item to cart
 * @route DELETE /api/cart - Clear cart
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

export async function GET() {
  try {
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const auth = await ensureAuth();
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const cart = CartRepository.getCart(auth.user.userId);

    return NextResponse.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch cart'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const auth = await ensureAuth();
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    const itemId = CartRepository.addItem(auth.user.userId, productId, quantity);

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data: { itemId }
    });

  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add item to cart'
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const auth = await ensureAuth();
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const count = CartRepository.clearCart(auth.user.userId);

    return NextResponse.json({
      success: true,
      message: `Cart cleared (${count} items removed)`
    });

  } catch (error) {
    console.error('Cart clear error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear cart'
    }, { status: 500 });
  }
}
