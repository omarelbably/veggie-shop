/**
 * Single Order API Route
 * 
 * Handles single order operations.
 * 
 * @route GET /api/orders/[id] - Get order details
 */

import { NextRequest, NextResponse } from 'next/server';
import { OrderRepository } from '@/repositories';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid order ID'
      }, { status: 400 });
    }

    const order = OrderRepository.getOrderWithItems(orderId);

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    // Ensure user owns this order
    if (order.user_id !== auth.user.userId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order'
    }, { status: 500 });
  }
}
