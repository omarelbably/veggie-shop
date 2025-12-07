/**
 * Order Repository
 * 
 * Data access layer for Order entity following the Repository Pattern.
 * 
 * @module repositories/orderRepository
 */

import { getDb } from '@/lib/db';
import { Order, OrderItem, OrderWithItems, OrderItemWithProduct, CartItemWithProduct } from '@/types';

/**
 * Order Repository Class
 * Handles order database operations
 */
export class OrderRepository {
  /**
   * Find an order by ID
   * @param id - Order ID
   * @returns Order or undefined
   */
  static findById(id: number): Order | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Order | undefined;
  }

  /**
   * Get order with items
   * @param orderId - Order ID
   * @returns Order with items or undefined
   */
  static getOrderWithItems(orderId: number): OrderWithItems | undefined {
    const db = getDb();
    
    const order = OrderRepository.findById(orderId);
    if (!order) return undefined;

    const items = db.prepare(`
      SELECT 
        oi.*,
        p.id as p_id, p.name, p.description, p.price_per_kg, 
        p.image_url, p.stock_quantity, p.in_stock, p.seller_name, p.category,
        p.created_at as p_created_at, p.updated_at as p_updated_at
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(orderId) as Array<OrderItem & {
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

    const orderItems: OrderItemWithProduct[] = items.map(item => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
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

    return {
      ...order,
      items: orderItems
    };
  }

  /**
   * Get all orders for a user
   * @param userId - User ID
   * @returns Array of orders with items
   */
  static getUserOrders(userId: number): OrderWithItems[] {
    const db = getDb();
    
    const orders = db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId) as Order[];

    return orders.map(order => OrderRepository.getOrderWithItems(order.id)!).filter(Boolean);
  }

  /**
   * Create a new order from cart items
   * @param userId - User ID
   * @param cartItems - Cart items to convert to order
   * @param deliveryAddress - Delivery address
   * @returns Order ID
   */
  static createFromCart(
    userId: number,
    cartItems: CartItemWithProduct[],
    deliveryAddress: string
  ): number {
    const db = getDb();
    
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + (item.quantity * item.product.price_per_kg),
      0
    );

    // Calculate estimated delivery (3-5 business days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 3);

    const transaction = db.transaction(() => {
      // Create order
      const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total_amount, status, delivery_address, estimated_delivery)
        VALUES (?, ?, 'processing', ?, ?)
      `).run(userId, Math.round(totalAmount * 100) / 100, deliveryAddress, estimatedDelivery.toISOString());

      const orderId = orderResult.lastInsertRowid as number;

      // Create order items
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (?, ?, ?, ?)
      `);

      for (const item of cartItems) {
        insertItem.run(orderId, item.product_id, item.quantity, item.product.price_per_kg);
        
        // Decrease stock
        db.prepare(`
          UPDATE products 
          SET stock_quantity = stock_quantity - ?,
              in_stock = CASE WHEN stock_quantity - ? > 0 THEN 1 ELSE 0 END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(item.quantity, item.quantity, item.product_id);
      }

      // Clear cart
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

      return orderId;
    });

    return transaction();
  }

  /**
   * Update order status
   * @param orderId - Order ID
   * @param status - New status
   * @returns Success boolean
   */
  static updateStatus(orderId: number, status: Order['status']): boolean {
    const db = getDb();
    const result = db.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, orderId);
    return result.changes > 0;
  }

  /**
   * Cancel an order
   * @param orderId - Order ID
   * @returns Success boolean
   */
  static cancelOrder(orderId: number): boolean {
    const db = getDb();
    
    const order = OrderRepository.getOrderWithItems(orderId);
    if (!order || order.status === 'cancelled' || order.status === 'delivered') {
      return false;
    }

    const transaction = db.transaction(() => {
      // Restore stock
      for (const item of order.items) {
        db.prepare(`
          UPDATE products 
          SET stock_quantity = stock_quantity + ?,
              in_stock = 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(item.quantity, item.product_id);
      }

      // Update order status
      db.prepare(`
        UPDATE orders 
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(orderId);

      return true;
    });

    return transaction();
  }
}

export default OrderRepository;
