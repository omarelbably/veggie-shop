/**
 * Cart Page
 * 
 * Shopping cart with quantity controls, wishlist, and checkout.
 * 
 * @page Cart
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    setUpdatingId(productId);
    await updateQuantity(productId, newQuantity);
    setUpdatingId(null);
  };

  const handleRemove = async (productId: number) => {
    setUpdatingId(productId);
    await removeFromCart(productId);
    setUpdatingId(null);
  };

  const handleMoveToWishlist = async (productId: number) => {
    setUpdatingId(productId);
    try {
      // Add to wishlist
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      // Remove from cart
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to move to wishlist:', error);
    }
    setUpdatingId(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any items yet.</p>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4 ${
                  updatingId === item.product_id ? 'opacity-50' : ''
                }`}
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-5xl flex-shrink-0">
                  🥬
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <Link href={`/product/${item.product_id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">Sold by: {item.product.seller_name}</p>
                  <p className="text-green-600 font-semibold mt-2">
                    ${item.product.price_per_kg.toFixed(2)}/kg
                  </p>

                  {/* Stock Status */}
                  {item.product.in_stock ? (
                    <p className="text-sm text-green-500 mt-1">✓ In Stock</p>
                  ) : (
                    <p className="text-sm text-red-500 mt-1">Out of Stock</p>
                  )}
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                      disabled={updatingId === item.product_id}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300 min-w-[50px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      disabled={updatingId === item.product_id}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    ${(item.quantity * item.product.price_per_kg).toFixed(2)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleMoveToWishlist(item.product_id)}
                      disabled={updatingId === item.product_id}
                      className="text-sm text-gray-500 hover:text-green-600 disabled:opacity-50"
                    >
                      Save for later
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      disabled={updatingId === item.product_id}
                      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(cart.totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span>${(cart.totalPrice * 1.1).toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="w-full block text-center mt-3 text-green-600 hover:text-green-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
