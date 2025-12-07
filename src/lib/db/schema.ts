/**
 * Database Schema Definition
 * 
 * This module defines all database tables for the Veggie Shop application.
 * It follows a normalized database design with proper relationships.
 * 
 * Tables:
 * - countries: Reference table for country codes and names
 * - users: Customer account information
 * - products: Vegetable product catalog
 * - cart_items: Shopping cart contents
 * - wishlist_items: User wishlists
 * - orders: Customer order headers
 * - order_items: Individual items in orders
 * 
 * @module lib/db/schema
 */

import { getDb } from './index';

/**
 * Initialize the database schema
 * Creates all tables if they don't exist
 * Uses foreign keys for referential integrity
 */
export function initializeSchema(): void {
  const db = getDb();

  // Countries reference table
  db.exec(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone_code TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table - stores customer account information
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT NOT NULL,
      country_id INTEGER NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (country_id) REFERENCES countries(id)
    )
  `);

  // Products table - vegetable catalog
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price_per_kg REAL NOT NULL,
      image_url TEXT NOT NULL,
      stock_quantity REAL NOT NULL DEFAULT 0,
      in_stock INTEGER NOT NULL DEFAULT 1,
      seller_name TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cart items - user shopping cart
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    )
  `);

  // Wishlist items
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    )
  `);

  // Orders table - order headers
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      delivery_address TEXT NOT NULL,
      estimated_delivery DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order items - individual products in an order
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      price_at_purchase REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
    CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_wishlist_items_user ON wishlist_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  `);

  console.log('Database schema initialized successfully');
}

export default initializeSchema;
