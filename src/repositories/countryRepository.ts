/**
 * Country Repository
 * 
 * Data access layer for Country entity following the Repository Pattern.
 * 
 * @module repositories/countryRepository
 */

import { getDb } from '@/lib/db';
import { Country } from '@/types';

/**
 * Country Repository Class
 * Handles country database operations
 */
export class CountryRepository {
  /**
   * Get all countries
   * @returns Array of countries
   */
  static findAll(): Country[] {
    const db = getDb();
    return db.prepare('SELECT * FROM countries ORDER BY name ASC').all() as Country[];
  }

  /**
   * Find country by ID
   * @param id - Country ID
   * @returns Country or undefined
   */
  static findById(id: number): Country | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM countries WHERE id = ?').get(id) as Country | undefined;
  }

  /**
   * Find country by code
   * @param code - Country code (e.g., 'US', 'GB')
   * @returns Country or undefined
   */
  static findByCode(code: string): Country | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM countries WHERE code = ?').get(code) as Country | undefined;
  }
}

export default CountryRepository;
