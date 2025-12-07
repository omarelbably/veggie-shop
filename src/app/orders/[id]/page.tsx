/**
 * Order Details Page
 * 
 * Shows detailed information about a specific order.
 * 
 * @page OrderDetails
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: number;
  total_amount: number;
  status: string;
  delivery_address: string;
  estimated_delivery: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch order
  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetch(`/api/orders/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '📦';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/orders"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at);
  const estimatedDate = order.estimated_delivery ? new Date(order.estimated_delivery) : null;
  const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * item.price_at_purchase), 0);
  const tax = order.total_amount - subtotal;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
              <p className="text-gray-500 mt-1">
                Placed on {orderDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
              <span className="mr-2">{getStatusIcon(order.status)}</span>
              <span className="font-semibold capitalize">{order.status}</span>
            </div>
          </div>

          {/* Estimated Delivery */}
          {estimatedDate && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-medium text-blue-800">Estimated Delivery</p>
                  <p className="text-blue-600">
                    {estimatedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items ({order.items.length})</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      🥬
                    </div>
                    <div className="flex-grow">
                      <Link
                        href={`/product/${item.product_id}`}
                        className="font-medium text-gray-800 hover:text-green-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {item.quantity} kg × ${item.price_at_purchase.toFixed(2)}/kg
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800 text-lg">
                      ${(item.quantity * item.price_at_purchase).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Delivery */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h2>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📍</span>
                <p className="text-gray-600">{order.delivery_address}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💵</span>
                <span className="text-gray-600">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="text-green-600 hover:text-green-700 font-medium">
              Contact Support
            </button>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Track Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
