/**
 * User Logout API Route
 * 
 * Handles user logout by removing authentication cookie.
 * 
 * @route POST /api/auth/logout
 */

import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    await removeAuthCookie();
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}
