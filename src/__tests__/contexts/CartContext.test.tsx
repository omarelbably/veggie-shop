/**
 * Unit Tests for CartContext
 * 
 * @test CartContext
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Test component that uses the cart context
function TestComponent() {
  const { cart, isLoading, addToCart, removeFromCart, updateQuantity } = useCart();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <span data-testid="total-items">{cart.totalItems}</span>
      <span data-testid="total-price">{cart.totalPrice.toFixed(2)}</span>
      <button onClick={() => addToCart(1, 2)}>Add Product</button>
      <button onClick={() => removeFromCart(1)}>Remove Product</button>
      <button onClick={() => updateQuantity(1, 5)}>Update Quantity</button>
    </div>
  );
}

// Wrapper with both providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </AuthProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: false }),
    });
  });

  it('provides initial empty cart state', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
    });
  });

  it('shows loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ json: () => ({ success: false }) }), 1000))
    );

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('throws error when useCart is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useCart must be used within a CartProvider');
    
    consoleSpy.mockRestore();
  });

  it('renders add product button', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument();
    });
  });

  it('renders remove product button', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Remove Product')).toBeInTheDocument();
    });
  });

  it('renders update quantity button', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Update Quantity')).toBeInTheDocument();
    });
  });
});
