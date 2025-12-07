/**
 * Product Grid Component
 * 
 * Displays products in a responsive grid layout with filtering and sorting.
 * 
 * @component ProductGrid
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

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

interface ProductGridProps {
  initialProducts?: Product[];
}

export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (showInStockOnly) params.set('inStock', 'true');
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      params.set('page', page.toString());
      params.set('pageSize', '12');

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.items);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, category, sortBy, sortOrder, showInStockOnly, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sortBy, sortOrder, showInStockOnly]);

  return (
    <div>
      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 rounded"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>

            {/* In Stock Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">In Stock Only</span>
            </label>
          </div>

          {/* Results Info */}
          <div className="text-sm text-gray-500">
            {search && <span>Results for &quot;{search}&quot;</span>}
            {category && <span>Category: {category}</span>}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🥬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-md ${
                      page === i + 1
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
