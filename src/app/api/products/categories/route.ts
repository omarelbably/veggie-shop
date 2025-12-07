/**
 * Product Categories API Route
 * 
 * Returns all unique product categories.
 * 
 * @route GET /api/products/categories
 */

import { NextResponse } from 'next/server';
import { ProductRepository } from '@/repositories';
import { seedDatabase } from '@/lib/db/seed';

// Initialize database on first request
let initialized = false;

export async function GET() {
  try {
    // Initialize database if not already done
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const categories = ProductRepository.getCategories();

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
}
