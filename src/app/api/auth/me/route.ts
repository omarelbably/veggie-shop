/**
 * Current User API Route
 * 
 * Returns the currently authenticated user's information.
 * 
 * @route GET /api/auth/me
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { UserRepository } from '@/repositories';
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

    const payload = await getCurrentUser();

    if (!payload) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 });
    }

    const user = UserRepository.findById(payload.userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        mobile: user.mobile,
        countryId: user.country_id
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication check failed'
    }, { status: 500 });
  }
}
