// Jest setup file
import '@testing-library/jest-dom';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement('a', { href }, children);
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock fetch globally
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
