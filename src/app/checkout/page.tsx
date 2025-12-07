/**
 * Checkout Page
 * 
 * Order placement with delivery address and confirmation.
 * 
 * @page Checkout
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface OrderResult {
  id: number;
  total_amount: number;
  status: string;
  estimated_delivery: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { cart, refreshCart, isLoading: cartLoading } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (!cartLoading && cart.items.length === 0 && !orderResult) {
      router.push('/cart');
    }
  }, [cart.items.length, cartLoading, orderResult, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryAddress })
      });

      const data = await response.json();

      if (data.success) {
        setOrderResult(data.data);
        await refreshCart();
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setIsProcessing(false);
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Order Success View
  if (orderResult) {
    const estimatedDate = new Date(orderResult.estimated_delivery);
    const formattedDate = estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase, {user?.firstName}!</p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-semibold text-gray-800">#{orderResult.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-green-600">${orderResult.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-yellow-600 capitalize">{orderResult.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-semibold text-gray-800">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <span className="text-2xl">🚚</span>
                <span className="font-medium">Your order will be delivered by {formattedDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                View My Orders
              </Link>
              <Link
                href="/"
                className="border border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Checkout Form View
  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <textarea
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full delivery address including street, city, state, and zip code"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method (Placeholder) */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <input type="radio" id="cod" name="payment" checked readOnly className="h-4 w-4 text-green-600" />
                    <label htmlFor="cod" className="text-gray-700 font-medium">Cash on Delivery</label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 ml-7">Pay when your order is delivered</p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items ({cart.totalItems})</h2>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-2xl">
                        🥬
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity} kg × ${item.product.price_per_kg.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${(item.quantity * item.product.price_per_kg).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing || !deliveryAddress.trim()}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <Link
                href="/cart"
                className="w-full block text-center mt-3 text-green-600 hover:text-green-700 font-medium"
              >
                Back to Cart
              </Link>

              {/* Security Note */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-1">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
