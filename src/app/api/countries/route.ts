/**
 * Countries API Route
 * 
 * Returns list of countries for registration form.
 * 
 * @route GET /api/countries
 */

import { NextResponse } from 'next/server';
import { CountryRepository } from '@/repositories';
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

    const countries = CountryRepository.findAll();

    return NextResponse.json({
      success: true,
      data: countries.map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        phoneCode: c.phone_code
      }))
    });

  } catch (error) {
    console.error('Countries fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch countries'
    }, { status: 500 });
  }
}
