/**
 * Orders API Route
 * 
 * Handles order operations: get all, create.
 * 
 * @route GET /api/orders - Get user's orders
 * @route POST /api/orders - Create new order from cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { OrderRepository, CartRepository } from '@/repositories';
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

    const orders = OrderRepository.getUserOrders(auth.user.userId);

    return NextResponse.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders'
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
    const { deliveryAddress } = body;

    if (!deliveryAddress) {
      return NextResponse.json({
        success: false,
        error: 'Delivery address is required'
      }, { status: 400 });
    }

    // Get cart items
    const cart = CartRepository.getCart(auth.user.userId);

    if (cart.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Cart is empty'
      }, { status: 400 });
    }

    // Create order
    const orderId = OrderRepository.createFromCart(
      auth.user.userId,
      cart.items,
      deliveryAddress
    );

    const order = OrderRepository.getOrderWithItems(orderId);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: order
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create order'
    }, { status: 500 });
  }
}
