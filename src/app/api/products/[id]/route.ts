/**
 * Single Product API Route
 * 
 * Handles fetching a single product by ID.
 * 
 * @route GET /api/products/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductRepository } from '@/repositories';
import { seedDatabase } from '@/lib/db/seed';

// Initialize database on first request
let initialized = false;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Initialize database if not already done
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    const product = ProductRepository.findById(productId);

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 });
  }
}
