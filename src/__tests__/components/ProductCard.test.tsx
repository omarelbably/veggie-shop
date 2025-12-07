/**
 * Unit Tests for ProductCard Component
 * 
 * @test ProductCard
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Fresh Tomatoes',
  description: 'Ripe red tomatoes perfect for salads',
  price_per_kg: 2.99,
  image_url: '/images/tomatoes.jpg',
  stock_quantity: 100,
  in_stock: 1,
  seller_name: 'Green Farm',
  category: 'Vegetables',
};

const mockOutOfStockProduct = {
  ...mockProduct,
  id: 2,
  name: 'Rare Mushrooms',
  stock_quantity: 0,
  in_stock: 0,
};

// Wrapper component with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </AuthProvider>
);

describe('ProductCard Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('renders product name correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Fresh Tomatoes')).toBeInTheDocument();
  });

  it('renders product price correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('$2.99/kg')).toBeInTheDocument();
  });

  it('renders seller name correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Green Farm')).toBeInTheDocument();
  });

  it('displays out of stock badge when product is out of stock', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockOutOfStockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('disables add to cart button when product is out of stock', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockOutOfStockProduct} />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDisabled();
  });

  it('renders add to cart button for in-stock products', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).not.toBeDisabled();
  });

  it('renders product link correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });

  it('renders product description', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Ripe red tomatoes perfect for salads')).toBeInTheDocument();
  });
});
