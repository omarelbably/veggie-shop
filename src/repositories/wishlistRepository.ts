/**
 * Wishlist Repository
 * 
 * Data access layer for Wishlist operations following the Repository Pattern.
 * 
 * @module repositories/wishlistRepository
 */

import { getDb } from '@/lib/db';
import { WishlistItem, WishlistItemWithProduct } from '@/types';

/**
 * Wishlist Repository Class
 * Handles wishlist database operations
 */
export class WishlistRepository {
  /**
   * Get all wishlist items for a user
   * @param userId - User ID
   * @returns Array of wishlist items with products
   */
  static getWishlist(userId: number): WishlistItemWithProduct[] {
    const db = getDb();
    
    const items = db.prepare(`
      SELECT 
        wi.*,
        p.id as p_id, p.name, p.description, p.price_per_kg, 
        p.image_url, p.stock_quantity, p.in_stock, p.seller_name, p.category,
        p.created_at as p_created_at, p.updated_at as p_updated_at
      FROM wishlist_items wi
      JOIN products p ON wi.product_id = p.id
      WHERE wi.user_id = ?
      ORDER BY wi.created_at DESC
    `).all(userId) as Array<WishlistItem & {
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

    return items.map(item => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      created_at: item.created_at,
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
  }

  /**
   * Add item to wishlist
   * @param userId - User ID
   * @param productId - Product ID
   * @returns Wishlist item ID or existing ID if already in wishlist
   */
  static addItem(userId: number, productId: number): number {
    const db = getDb();
    
    // Check if already in wishlist
    const existing = db.prepare(
      'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?'
    ).get(userId, productId) as { id: number } | undefined;

    if (existing) {
      return existing.id;
    }

    const result = db.prepare(`
      INSERT INTO wishlist_items (user_id, product_id)
      VALUES (?, ?)
    `).run(userId, productId);

    return result.lastInsertRowid as number;
  }

  /**
   * Remove item from wishlist
   * @param userId - User ID
   * @param productId - Product ID
   * @returns Success boolean
   */
  static removeItem(userId: number, productId: number): boolean {
    const db = getDb();
    const result = db.prepare(
      'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?'
    ).run(userId, productId);
    return result.changes > 0;
  }

  /**
   * Check if product is in user's wishlist
   * @param userId - User ID
   * @param productId - Product ID
   * @returns Boolean
   */
  static isInWishlist(userId: number, productId: number): boolean {
    const db = getDb();
    const result = db.prepare(
      'SELECT COUNT(*) as count FROM wishlist_items WHERE user_id = ? AND product_id = ?'
    ).get(userId, productId) as { count: number };
    return result.count > 0;
  }

  /**
   * Move item from wishlist to cart
   * @param userId - User ID
   * @param productId - Product ID
   * @param quantity - Quantity to add to cart
   * @returns Success boolean
   */
  static moveToCart(userId: number, productId: number, quantity: number = 1): boolean {
    const db = getDb();
    
    const transaction = db.transaction(() => {
      // Add to cart
      const existing = db.prepare(
        'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?'
      ).get(userId, productId) as { id: number; quantity: number } | undefined;

      if (existing) {
        db.prepare(`
          UPDATE cart_items 
          SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(quantity, existing.id);
      } else {
        db.prepare(`
          INSERT INTO cart_items (user_id, product_id, quantity)
          VALUES (?, ?, ?)
        `).run(userId, productId, quantity);
      }

      // Remove from wishlist
      db.prepare(
        'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?'
      ).run(userId, productId);

      return true;
    });

    return transaction();
  }

  /**
   * Clear all items from user's wishlist
   * @param userId - User ID
   * @returns Number of items removed
   */
  static clearWishlist(userId: number): number {
    const db = getDb();
    const result = db.prepare('DELETE FROM wishlist_items WHERE user_id = ?').run(userId);
    return result.changes;
  }
}

export default WishlistRepository;
