/**
 * User Login API Route
 * 
 * Handles user authentication with email and password.
 * 
 * @route POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/repositories';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { seedDatabase } from '@/lib/db/seed';

// Initialize database on first request
let initialized = false;

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!initialized) {
      seedDatabase();
      initialized = true;
    }

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Verify credentials
    const user = await UserRepository.verifyPassword(email, password);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // Generate token
    const token = await generateToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
}
