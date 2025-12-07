/**
 * JWT Authentication Utilities
 * 
 * This module handles JWT token generation and verification using jose library.
 * Follows security best practices for token management.
 * 
 * @module lib/auth
 */

import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from '@/types';
import { cookies } from 'next/headers';

// Secret key for JWT signing (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'veggie-shop-super-secret-key-change-in-production'
);

const TOKEN_NAME = 'veggie-auth-token';
const TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Generate a JWT token for a user
 * @param payload - User data to encode in token
 * @returns JWT token string
 */
export async function generateToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Set authentication cookie
 * @param token - JWT token to store
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

/**
 * Get authentication cookie
 * @returns Token string or null
 */
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(TOKEN_NAME);
  return cookie?.value || null;
}

/**
 * Remove authentication cookie (logout)
 */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

/**
 * Get current authenticated user from cookie
 * @returns User payload or null if not authenticated
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
