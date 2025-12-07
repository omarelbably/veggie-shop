/**
 * Unit Tests for Navbar Component
 * 
 * @test Navbar
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

// Wrapper component with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </AuthProvider>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: false }),
    });
  });

  it('renders the logo/brand name', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    expect(screen.getByText('VeggieShop')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('renders login link when user is not authenticated', async () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Wait for auth check to complete
    await screen.findByText(/sign in/i);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('renders cart icon', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Cart link should be present
    const cartLinks = screen.getAllByRole('link').filter(
      link => link.getAttribute('href') === '/cart'
    );
    expect(cartLinks.length).toBeGreaterThan(0);
  });

  it('search input is focusable', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);
  });

  it('has correct home link', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    const homeLinks = screen.getAllByRole('link').filter(
      link => link.getAttribute('href') === '/'
    );
    expect(homeLinks.length).toBeGreaterThan(0);
  });
});
