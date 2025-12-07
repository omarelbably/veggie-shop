/**
 * Cart Context
 * 
 * Provides shopping cart state and methods throughout the application.
 * 
 * @module contexts/CartContext
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price_per_kg: number;
  image_url: string;
  stock_quantity: number;
  in_stock: number;
  seller_name: string;
  category: string;
}

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType {
  cart: CartSummary;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const emptyCart: CartSummary = { items: [], totalItems: 0, totalPrice: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartSummary>(emptyCart);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCart(data.data);
      }
    } catch {
      console.error('Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();
      if (data.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();
      if (data.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch('/api/cart', { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setCart(emptyCart);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
