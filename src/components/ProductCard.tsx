/**
 * Product Card Component
 * 
 * Displays a single product in a card format.
 * Used in product listings and search results.
 * 
 * @component ProductCard
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsAdding(true);
    const success = await addToCart(product.id, 1);
    setIsAdding(false);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const isOutOfStock = !product.in_stock || product.stock_quantity <= 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
        {/* Image Container */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-green-50 to-green-100">
            🥬
          </div>
          
          {/* Stock Badge */}
          {isOutOfStock ? (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          ) : product.stock_quantity < 10 ? (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              Low Stock
            </div>
          ) : null}

          {/* Quick Add Button */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="absolute bottom-2 right-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
            >
              {isAdding ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-green-600">
                ${product.price_per_kg.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">/kg</span>
            </div>
            
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Sold by: {product.seller_name}
          </p>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1 rounded-lg shadow-lg animate-fade-in">
            Added to cart!
          </div>
        )}
      </div>
    </Link>
  );
}
