/**
 * Navbar Component
 * 
 * Main navigation component with search, cart, and user menu.
 * Amazon-style responsive navigation.
 * 
 * @component Navbar
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">🥬</span>
            <span className="text-white text-xl font-bold hidden sm:block">VeggieShop</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for fresh vegetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-12 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:outline-none text-gray-800"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 px-4 py-1 rounded-md text-gray-800 font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-white hover:text-yellow-300 transition-colors flex items-center space-x-1"
              >
                <span className="text-sm hidden md:block">
                  {isAuthenticated ? `Hello, ${user?.firstName}` : 'Hello, Sign in'}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Wishlist
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative text-white hover:text-yellow-300 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Bar */}
      <div className="bg-green-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-6 py-2 overflow-x-auto">
            <Link href="/" className="text-white text-sm hover:text-yellow-300 whitespace-nowrap">
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/?category=${encodeURIComponent(category)}`}
                className="text-white text-sm hover:text-yellow-300 whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-green-800">
          <div className="px-4 py-2 space-y-2">
            <Link href="/" className="block text-white py-2" onClick={() => setShowMobileMenu(false)}>
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/?category=${encodeURIComponent(category)}`}
                className="block text-white py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
