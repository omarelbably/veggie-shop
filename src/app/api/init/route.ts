/**
 * Database Initialization API Route
 * 
 * This route initializes the database schema and seeds initial data.
 * Should be called once when setting up the application.
 * 
 * @route GET /api/init
 */

import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function GET() {
  try {
    seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database initialized and seeded successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize database'
    }, { status: 500 });
  }
}
