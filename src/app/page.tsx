/**
 * Home Page
 * 
 * Main landing page displaying featured products and product grid.
 * 
 * @page Home
 */

import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';

function ProductGridFallback() {
  return (
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
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fresh Vegetables,<br />Delivered Daily
              </h1>
              <p className="text-lg text-green-100 mb-6">
                Shop from our wide selection of farm-fresh vegetables. 
                Quality you can taste, prices you&apos;ll love.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#products"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Shop Now
                </a>
                <a
                  href="/?category=Leafy%20Greens"
                  className="border-2 border-white hover:bg-white hover:text-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Browse Categories
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="text-9xl">🥬🥕🥦</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-4">
              <div className="text-4xl">🚚</div>
              <div>
                <h3 className="font-semibold text-gray-800">Free Delivery</h3>
                <p className="text-sm text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4">
              <div className="text-4xl">🌿</div>
              <div>
                <h3 className="font-semibold text-gray-800">100% Fresh</h3>
                <p className="text-sm text-gray-500">Farm to table quality</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4">
              <div className="text-4xl">💰</div>
              <div>
                <h3 className="font-semibold text-gray-800">Best Prices</h3>
                <p className="text-sm text-gray-500">Competitive pricing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4">
              <div className="text-4xl">🔒</div>
              <div>
                <h3 className="font-semibold text-gray-800">Secure Payment</h3>
                <p className="text-sm text-gray-500">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Fresh Products</h2>
          <Suspense fallback={<ProductGridFallback />}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
