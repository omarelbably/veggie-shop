/**
 * Database Connection Module
 * 
 * This module provides a singleton SQLite database connection using better-sqlite3.
 * It follows the Singleton pattern to ensure only one database connection exists.
 * 
 * @module lib/db
 * @description SQLite database initialization and connection management
 */

import Database from 'better-sqlite3';
import path from 'path';

// Database file path - stored in project root
const DB_PATH = path.join(process.cwd(), 'veggie-shop.db');

/**
 * Singleton database instance
 * Uses better-sqlite3 for synchronous SQLite operations
 */
let db: Database.Database | null = null;

/**
 * Get the database connection instance
 * Creates a new connection if one doesn't exist (Singleton Pattern)
 * 
 * @returns {Database.Database} The SQLite database instance
 * @example
 * const db = getDb();
 * const users = db.prepare('SELECT * FROM users').all();
 */
export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Better performance for concurrent reads
    db.pragma('foreign_keys = ON'); // Enforce foreign key constraints
  }
  return db;
}

/**
 * Close the database connection
 * Should be called when shutting down the application
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export default getDb;
