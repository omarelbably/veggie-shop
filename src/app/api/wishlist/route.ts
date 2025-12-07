/**
 * Wishlist API Route
 * 
 * Handles wishlist operations: get, add.
 * 
 * @route GET /api/wishlist - Get wishlist
 * @route POST /api/wishlist - Add item to wishlist
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

    const wishlist = WishlistRepository.getWishlist(auth.user.userId);

    return NextResponse.json({
      success: true,
      data: wishlist
    });

  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch wishlist'
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    const itemId = WishlistRepository.addItem(auth.user.userId, productId);

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist',
      data: { itemId }
    });

  } catch (error) {
    console.error('Wishlist add error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add item to wishlist'
    }, { status: 500 });
  }
}
