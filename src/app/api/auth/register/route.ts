/**
 * User Registration API Route
 * 
 * Handles new user registration with validation.
 * 
 * @route POST /api/auth/register
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
    const { firstName, lastName, email, mobile, countryId, password, confirmPassword } = body;

    // Validation
    if (!firstName || !lastName || !email || !mobile || !countryId || !password) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Passwords do not match'
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters'
      }, { status: 400 });
    }

    // Check if email already exists
    if (UserRepository.emailExists(email)) {
      return NextResponse.json({
        success: false,
        error: 'Email already registered'
      }, { status: 409 });
    }

    // Create user
    const userId = await UserRepository.create({
      firstName,
      lastName,
      email,
      mobile,
      countryId: parseInt(countryId),
      password
    });

    // Generate token
    const token = await generateToken({ userId, email });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        userId,
        email
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Registration failed'
    }, { status: 500 });
  }
}
