/**
 * Products API Route
 * 
 * Handles product listing with filtering, sorting, and pagination.
 * 
 * @route GET /api/products
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductRepository } from '@/repositories';
import { ProductFilters } from '@/types';
import { seedDatabase } from '@/lib/db/seed';

// Initialize database on first request
let initialized = false;

export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const filters: ProductFilters = {};

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const category = searchParams.get('category');
    if (category) filters.category = category;

    const inStock = searchParams.get('inStock');
    if (inStock !== null) filters.inStock = inStock === 'true';

    const minPrice = searchParams.get('minPrice');
    if (minPrice) filters.minPrice = parseFloat(minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    const sortBy = searchParams.get('sortBy') as ProductFilters['sortBy'];
    if (sortBy) filters.sortBy = sortBy;

    const sortOrder = searchParams.get('sortOrder') as ProductFilters['sortOrder'];
    if (sortOrder) filters.sortOrder = sortOrder;

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

    const result = ProductRepository.findAll(filters, page, pageSize);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}
