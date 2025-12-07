/**
 * Wishlist Page
 * 
 * Displays user's saved items with move to cart functionality.
 * 
 * @page Wishlist
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    description: string;
    price_per_kg: number;
    image_url: string;
    stock_quantity: number;
    in_stock: number;
    seller_name: string;
    category: string;
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { refreshCart } = useCart();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      if (data.success) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleMoveToCart = async (productId: number) => {
    setProcessingId(productId);
    try {
      const response = await fetch(`/api/wishlist/${productId}/move-to-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 })
      });
      const data = await response.json();
      if (data.success) {
        await fetchWishlist();
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to move to cart:', error);
    }
    setProcessingId(null);
  };

  const handleRemove = async (productId: number) => {
    setProcessingId(productId);
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
    setProcessingId(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">💚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love for later!</p>
            <Link
              href="/"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const isOutOfStock = !item.product.in_stock || item.product.stock_quantity <= 0;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  processingId === item.product_id ? 'opacity-50' : ''
                }`}
              >
                {/* Product Image */}
                <Link href={`/product/${item.product_id}`}>
                  <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-6xl">
                    🥬
                    {isOutOfStock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4">
                  <Link href={`/product/${item.product_id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.product.description}</p>
                  <p className="text-green-600 font-bold mt-2">
                    ${item.product.price_per_kg.toFixed(2)}/kg
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Sold by: {item.product.seller_name}</p>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => handleMoveToCart(item.product_id)}
                      disabled={isOutOfStock || processingId === item.product_id}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === item.product_id ? 'Moving...' : 'Move to Cart'}
                    </button>
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      disabled={processingId === item.product_id}
                      className="w-full border border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-500 font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
