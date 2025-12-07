/**
 * Type Definitions
 * 
 * This module contains all TypeScript interfaces and types used throughout the application.
 * Following the Interface Segregation Principle (ISP) from SOLID.
 * 
 * @module types
 */

// ==================== User Types ====================

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  country_id: number;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  countryId: number;
  password: string;
}

export interface UserPublic {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  countryId: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ==================== Country Types ====================

export interface Country {
  id: number;
  code: string;
  name: string;
  phone_code: string;
}

// ==================== Product Types ====================

export interface Product {
  id: number;
  name: string;
  description: string;
  price_per_kg: number;
  image_url: string;
  stock_quantity: number;
  in_stock: number;
  seller_name: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'stock';
  sortOrder?: 'asc' | 'desc';
}

// ==================== Cart Types ====================

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface CartSummary {
  items: CartItemWithProduct[];
  totalItems: number;
  totalPrice: number;
}

// ==================== Wishlist Types ====================

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
}

export interface WishlistItemWithProduct extends WishlistItem {
  product: Product;
}

// ==================== Order Types ====================

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address: string;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
}

export interface CreateOrderDTO {
  deliveryAddress: string;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== JWT Types ====================

export interface JWTPayload {
  userId: number;
  email: string;
  exp?: number;
  iat?: number;
}

// ==================== Form Types ====================

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  countryId: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
