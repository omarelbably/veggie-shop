/**
 * Product Repository
 * 
 * Data access layer for Product entity following the Repository Pattern.
 * Handles all database operations related to products.
 * 
 * @module repositories/productRepository
 */

import { getDb } from '@/lib/db';
import { Product, ProductFilters, PaginatedResponse } from '@/types';

/**
 * Product Repository Class
 * Implements CRUD and search operations for Product entity
 */
export class ProductRepository {
  /**
   * Find a product by ID
   * @param id - Product ID
   * @returns Product or undefined
   */
  static findById(id: number): Product | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
  }

  /**
   * Get all products with optional filtering and pagination
   * @param filters - Filter options
   * @param page - Page number (1-indexed)
   * @param pageSize - Items per page
   * @returns Paginated product list
   */
  static findAll(
    filters: ProductFilters = {},
    page: number = 1,
    pageSize: number = 12
  ): PaginatedResponse<Product> {
    const db = getDb();
    const conditions: string[] = [];
    const params: unknown[] = [];

    // Build WHERE conditions
    if (filters.search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.inStock !== undefined) {
      conditions.push('in_stock = ?');
      params.push(filters.inStock ? 1 : 0);
    }

    if (filters.minPrice !== undefined) {
      conditions.push('price_per_kg >= ?');
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      conditions.push('price_per_kg <= ?');
      params.push(filters.maxPrice);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    let orderBy = 'ORDER BY name ASC';
    if (filters.sortBy) {
      const sortColumn = {
        name: 'name',
        price: 'price_per_kg',
        stock: 'stock_quantity'
      }[filters.sortBy];
      const sortOrder = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
      orderBy = `ORDER BY ${sortColumn} ${sortOrder}`;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM products ${whereClause}`;
    const { count: total } = db.prepare(countQuery).get(...params) as { count: number };

    // Get paginated results
    const offset = (page - 1) * pageSize;
    const query = `
      SELECT * FROM products 
      ${whereClause} 
      ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const items = db.prepare(query).all(...params, pageSize, offset) as Product[];

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  /**
   * Get all unique categories
   * @returns Array of category names
   */
  static getCategories(): string[] {
    const db = getDb();
    const results = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all() as { category: string }[];
    return results.map(r => r.category);
  }

  /**
   * Update product stock
   * @param id - Product ID
   * @param quantity - New stock quantity
   * @returns Success boolean
   */
  static updateStock(id: number, quantity: number): boolean {
    const db = getDb();
    const result = db.prepare(`
      UPDATE products 
      SET stock_quantity = ?, in_stock = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(quantity, quantity > 0 ? 1 : 0, id);
    return result.changes > 0;
  }

  /**
   * Decrease product stock
   * @param id - Product ID
   * @param amount - Amount to decrease
   * @returns Success boolean
   */
  static decreaseStock(id: number, amount: number): boolean {
    const db = getDb();
    const product = ProductRepository.findById(id);
    if (!product || product.stock_quantity < amount) return false;

    const newQuantity = product.stock_quantity - amount;
    return ProductRepository.updateStock(id, newQuantity);
  }

  /**
   * Search products by name
   * @param query - Search query
   * @param limit - Maximum results
   * @returns Array of products
   */
  static search(query: string, limit: number = 10): Product[] {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM products 
      WHERE name LIKE ? 
      ORDER BY name ASC 
      LIMIT ?
    `).all(`%${query}%`, limit) as Product[];
  }

  /**
   * Get featured products (in stock, varied categories)
   * @param limit - Number of products to return
   * @returns Array of featured products
   */
  static getFeatured(limit: number = 8): Product[] {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM products 
      WHERE in_stock = 1 
      ORDER BY RANDOM() 
      LIMIT ?
    `).all(limit) as Product[];
  }
}

export default ProductRepository;
