/**
 * User Repository
 * 
 * Data access layer for User entity following the Repository Pattern.
 * This layer abstracts database operations from the business logic.
 * 
 * @module repositories/userRepository
 */

import { getDb } from '@/lib/db';
import { User, UserCreateDTO } from '@/types';
import bcrypt from 'bcryptjs';

/**
 * User Repository Class
 * Implements CRUD operations for User entity
 */
export class UserRepository {
  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User or undefined
   */
  static findById(id: number): User | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  }

  /**
   * Find a user by email
   * @param email - User email address
   * @returns User or undefined
   */
  static findByEmail(email: string): User | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
  }

  /**
   * Create a new user
   * @param userData - User creation data
   * @returns Created user ID
   */
  static async create(userData: UserCreateDTO): Promise<number> {
    const db = getDb();
    const passwordHash = await bcrypt.hash(userData.password, 12);

    const result = db.prepare(`
      INSERT INTO users (first_name, last_name, email, mobile, country_id, password_hash)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.mobile,
      userData.countryId,
      passwordHash
    );

    return result.lastInsertRowid as number;
  }

  /**
   * Update a user
   * @param id - User ID
   * @param data - Partial user data to update
   * @returns Success boolean
   */
  static update(id: number, data: Partial<Omit<User, 'id' | 'created_at'>>): boolean {
    const db = getDb();
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.first_name) {
      fields.push('first_name = ?');
      values.push(data.first_name);
    }
    if (data.last_name) {
      fields.push('last_name = ?');
      values.push(data.last_name);
    }
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.mobile) {
      fields.push('mobile = ?');
      values.push(data.mobile);
    }
    if (data.country_id) {
      fields.push('country_id = ?');
      values.push(data.country_id);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = db.prepare(`
      UPDATE users SET ${fields.join(', ')} WHERE id = ?
    `).run(...values);

    return result.changes > 0;
  }

  /**
   * Verify user password
   * @param email - User email
   * @param password - Plain text password
   * @returns User if valid, undefined if invalid
   */
  static async verifyPassword(email: string, password: string): Promise<User | undefined> {
    const user = UserRepository.findByEmail(email);
    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : undefined;
  }

  /**
   * Check if email already exists
   * @param email - Email to check
   * @returns Boolean indicating if email exists
   */
  static emailExists(email: string): boolean {
    const db = getDb();
    const result = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').get(email) as { count: number };
    return result.count > 0;
  }
}

export default UserRepository;
