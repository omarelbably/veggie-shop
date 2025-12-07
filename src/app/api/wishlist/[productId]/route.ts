/**
 * Wishlist Item API Route
 * 
 * Handles individual wishlist item operations.
 * 
 * @route DELETE /api/wishlist/[productId] - Remove item
 * @route POST /api/wishlist/[productId]/move-to-cart - Move to cart
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
    const success = WishlistRepository.removeItem(auth.user.userId, parseInt(productId));

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Item not found in wishlist'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist'
    });

  } catch (error) {
    console.error('Wishlist remove error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove item from wishlist'
    }, { status: 500 });
  }
}
