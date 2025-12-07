/**
 * Product Detail Page
 * 
 * Shows full product information with add to cart functionality.
 * 
 * @page ProductDetail
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    const success = await addToCart(product!.id, quantity);
    setIsAddingToCart(false);

    if (success) {
      setShowSuccess('Added to cart!');
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product!.id })
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccess('Added to wishlist!');
        setTimeout(() => setShowSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
    setIsAddingToWishlist(false);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    const success = await addToCart(product!.id, quantity);
    setIsAddingToCart(false);

    if (success) {
      router.push('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = !product.in_stock || product.stock_quantity <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-green-600 hover:text-green-700">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/?category=${encodeURIComponent(product.category)}`}
                className="text-green-600 hover:text-green-700"
              >
                {product.category}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">{product.name}</li>
          </ol>
        </nav>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {showSuccess}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-[150px]">
                🥬
              </div>
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm text-green-600 font-medium">{product.category}</span>
                <h1 className="text-3xl font-bold text-gray-800 mt-1">{product.name}</h1>
                <p className="text-gray-500 mt-2">Sold by: <span className="font-medium">{product.seller_name}</span></p>
              </div>

              {/* Price */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-green-600">
                    ${product.price_per_kg.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-500">/kg</span>
                </div>
                {!isOutOfStock && product.stock_quantity < 20 && (
                  <p className="text-orange-500 mt-2">
                    Only {product.stock_quantity} kg left in stock!
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity (kg)</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock_quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                        className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-500">
                      Total: <span className="font-semibold text-gray-800">${(quantity * product.price_per_kg).toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isAddingToCart}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
                className="w-full border border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isAddingToWishlist ? 'Adding...' : 'Add to Wishlist'}</span>
              </button>

              {/* Product Features */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="font-medium text-gray-800">Free Delivery</p>
                      <p className="text-sm text-gray-500">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <p className="font-medium text-gray-800">Farm Fresh</p>
                      <p className="text-sm text-gray-500">Sourced daily</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
