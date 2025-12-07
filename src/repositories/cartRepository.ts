/**
 * Cart Repository
 * 
 * Data access layer for Cart operations following the Repository Pattern.
 * 
 * @module repositories/cartRepository
 */

import { getDb } from '@/lib/db';
import { CartItem, CartItemWithProduct, CartSummary, Product } from '@/types';

/**
 * Cart Repository Class
 * Handles shopping cart database operations
 */
export class CartRepository {
  /**
   * Get all cart items for a user
   * @param userId - User ID
   * @returns Cart summary with items and totals
   */
  static getCart(userId: number): CartSummary {
    const db = getDb();
    
    const items = db.prepare(`
      SELECT 
        ci.*,
        p.id as p_id, p.name, p.description, p.price_per_kg, 
        p.image_url, p.stock_quantity, p.in_stock, p.seller_name, p.category,
        p.created_at as p_created_at, p.updated_at as p_updated_at
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(userId) as Array<CartItem & {
      p_id: number;
      name: string;
      description: string;
      price_per_kg: number;
      image_url: string;
      stock_quantity: number;
      in_stock: number;
      seller_name: string;
      category: string;
      p_created_at: string;
      p_updated_at: string;
    }>;

    const cartItems: CartItemWithProduct[] = items.map(item => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: {
        id: item.p_id,
        name: item.name,
        description: item.description,
        price_per_kg: item.price_per_kg,
        image_url: item.image_url,
        stock_quantity: item.stock_quantity,
        in_stock: item.in_stock,
        seller_name: item.seller_name,
        category: item.category,
        created_at: item.p_created_at,
        updated_at: item.p_updated_at
      }
    }));

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price_per_kg), 0);

    return {
      items: cartItems,
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100
    };
  }

  /**
   * Add item to cart or update quantity if exists
   * @param userId - User ID
   * @param productId - Product ID
   * @param quantity - Quantity to add
   * @returns Cart item ID
   */
  static addItem(userId: number, productId: number, quantity: number = 1): number {
    const db = getDb();
    
    // Check if item already exists
    const existing = db.prepare(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?'
    ).get(userId, productId) as { id: number; quantity: number } | undefined;

    if (existing) {
      // Update quantity
      db.prepare(`
        UPDATE cart_items 
        SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(quantity, existing.id);
      return existing.id;
    }

    // Insert new item
    const result = db.prepare(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
    `).run(userId, productId, quantity);

    return result.lastInsertRowid as number;
  }

  /**
   * Update cart item quantity
   * @param userId - User ID
   * @param productId - Product ID
   * @param quantity - New quantity
   * @returns Success boolean
   */
  static updateQuantity(userId: number, productId: number, quantity: number): boolean {
    const db = getDb();

    if (quantity <= 0) {
      return CartRepository.removeItem(userId, productId);
    }

    const result = db.prepare(`
      UPDATE cart_items 
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND product_id = ?
    `).run(quantity, userId, productId);

    return result.changes > 0;
  }

  /**
   * Remove item from cart
   * @param userId - User ID
   * @param productId - Product ID
   * @returns Success boolean
   */
  static removeItem(userId: number, productId: number): boolean {
    const db = getDb();
    const result = db.prepare(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?'
    ).run(userId, productId);
    return result.changes > 0;
  }

  /**
   * Clear all items from user's cart
   * @param userId - User ID
   * @returns Number of items removed
   */
  static clearCart(userId: number): number {
    const db = getDb();
    const result = db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
    return result.changes;
  }

  /**
   * Get cart item count for a user
   * @param userId - User ID
   * @returns Number of items in cart
   */
  static getItemCount(userId: number): number {
    const db = getDb();
    const result = db.prepare(
      'SELECT COALESCE(SUM(quantity), 0) as count FROM cart_items WHERE user_id = ?'
    ).get(userId) as { count: number };
    return result.count;
  }
}

export default CartRepository;
