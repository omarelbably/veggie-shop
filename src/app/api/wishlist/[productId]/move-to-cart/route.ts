/**
 * Move Wishlist Item to Cart API Route
 * 
 * Moves an item from wishlist to cart.
 * 
 * @route POST /api/wishlist/[productId]/move-to-cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { WishlistRepository } from '@/repositories';
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

export async function POST(
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
    const body = await request.json().catch(() => ({}));
    const quantity = body.quantity || 1;

    const success = WishlistRepository.moveToCart(
      auth.user.userId,
      parseInt(productId),
      quantity
    );

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to move item to cart'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item moved to cart'
    });

  } catch (error) {
    console.error('Move to cart error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to move item to cart'
    }, { status: 500 });
  }
}
