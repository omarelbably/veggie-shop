/**
 * Orders Page
 * 
 * Displays user's order history with status tracking.
 * 
 * @page Orders
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to place your first order!</p>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = new Date(order.created_at);
            const estimatedDate = order.estimated_delivery ? new Date(order.estimated_delivery) : null;

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Order Placed</p>
                        <p className="text-sm font-medium text-gray-800">
                          {orderDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Total</p>
                        <p className="text-sm font-medium text-gray-800">${order.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Ship To</p>
                        <p className="text-sm font-medium text-gray-800 max-w-xs truncate">
                          {order.delivery_address}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase">Order #</p>
                      <p className="text-sm font-medium text-gray-800">{order.id}</p>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {estimatedDate && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <p className="text-sm text-gray-500 mt-1">
                          Estimated delivery: {estimatedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
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
                            {item.quantity} kg × ${item.price_at_purchase.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          ${(item.quantity * item.price_at_purchase).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      View Order Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Buy Again
                      </button>
                    )}
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
