/**
 * Database Seed Module
 * 
 * This module populates the database with initial data:
 * - Countries with phone codes
 * - 50 vegetable products with realistic data
 * 
 * @module lib/db/seed
 */

import { getDb } from './index';
import { initializeSchema } from './schema';

/**
 * Countries data for mobile number country selection
 */
const countries = [
  { code: 'US', name: 'United States', phone_code: '+1' },
  { code: 'GB', name: 'United Kingdom', phone_code: '+44' },
  { code: 'EG', name: 'Egypt', phone_code: '+20' },
  { code: 'SA', name: 'Saudi Arabia', phone_code: '+966' },
  { code: 'AE', name: 'United Arab Emirates', phone_code: '+971' },
  { code: 'DE', name: 'Germany', phone_code: '+49' },
  { code: 'FR', name: 'France', phone_code: '+33' },
  { code: 'IT', name: 'Italy', phone_code: '+39' },
  { code: 'ES', name: 'Spain', phone_code: '+34' },
  { code: 'NL', name: 'Netherlands', phone_code: '+31' },
  { code: 'BE', name: 'Belgium', phone_code: '+32' },
  { code: 'CH', name: 'Switzerland', phone_code: '+41' },
  { code: 'AT', name: 'Austria', phone_code: '+43' },
  { code: 'SE', name: 'Sweden', phone_code: '+46' },
  { code: 'NO', name: 'Norway', phone_code: '+47' },
  { code: 'DK', name: 'Denmark', phone_code: '+45' },
  { code: 'FI', name: 'Finland', phone_code: '+358' },
  { code: 'PL', name: 'Poland', phone_code: '+48' },
  { code: 'PT', name: 'Portugal', phone_code: '+351' },
  { code: 'GR', name: 'Greece', phone_code: '+30' },
  { code: 'IE', name: 'Ireland', phone_code: '+353' },
  { code: 'CZ', name: 'Czech Republic', phone_code: '+420' },
  { code: 'RO', name: 'Romania', phone_code: '+40' },
  { code: 'HU', name: 'Hungary', phone_code: '+36' },
  { code: 'TR', name: 'Turkey', phone_code: '+90' },
  { code: 'RU', name: 'Russia', phone_code: '+7' },
  { code: 'IN', name: 'India', phone_code: '+91' },
  { code: 'CN', name: 'China', phone_code: '+86' },
  { code: 'JP', name: 'Japan', phone_code: '+81' },
  { code: 'KR', name: 'South Korea', phone_code: '+82' },
  { code: 'AU', name: 'Australia', phone_code: '+61' },
  { code: 'NZ', name: 'New Zealand', phone_code: '+64' },
  { code: 'CA', name: 'Canada', phone_code: '+1' },
  { code: 'MX', name: 'Mexico', phone_code: '+52' },
  { code: 'BR', name: 'Brazil', phone_code: '+55' },
  { code: 'AR', name: 'Argentina', phone_code: '+54' },
  { code: 'CL', name: 'Chile', phone_code: '+56' },
  { code: 'CO', name: 'Colombia', phone_code: '+57' },
  { code: 'ZA', name: 'South Africa', phone_code: '+27' },
  { code: 'NG', name: 'Nigeria', phone_code: '+234' },
];

/**
 * 50 Vegetable products with realistic data
 */
const products = [
  // Leafy Greens
  { name: 'Fresh Spinach', description: 'Tender baby spinach leaves, perfect for salads and smoothies. Rich in iron and vitamins.', price_per_kg: 4.99, image_url: '/images/products/spinach.jpg', stock_quantity: 100, seller_name: 'Green Valley Farms', category: 'Leafy Greens' },
  { name: 'Organic Kale', description: 'Curly kale packed with nutrients. Great for chips, smoothies, or sautéed dishes.', price_per_kg: 5.49, image_url: '/images/products/kale.jpg', stock_quantity: 80, seller_name: 'Organic Harvest Co.', category: 'Leafy Greens' },
  { name: 'Romaine Lettuce', description: 'Crisp romaine hearts, ideal for Caesar salads and wraps.', price_per_kg: 3.99, image_url: '/images/products/romaine.jpg', stock_quantity: 120, seller_name: 'Fresh Fields Farm', category: 'Leafy Greens' },
  { name: 'Arugula', description: 'Peppery arugula leaves for gourmet salads and pizza toppings.', price_per_kg: 6.99, image_url: '/images/products/arugula.jpg', stock_quantity: 60, seller_name: 'Mediterranean Gardens', category: 'Leafy Greens' },
  { name: 'Swiss Chard', description: 'Colorful rainbow chard with tender leaves and crunchy stems.', price_per_kg: 4.49, image_url: '/images/products/chard.jpg', stock_quantity: 70, seller_name: 'Rainbow Produce', category: 'Leafy Greens' },
  { name: 'Collard Greens', description: 'Southern-style collard greens, perfect for braising and stewing.', price_per_kg: 3.49, image_url: '/images/products/collard.jpg', stock_quantity: 90, seller_name: 'Southern Harvest', category: 'Leafy Greens' },
  { name: 'Iceberg Lettuce', description: 'Classic crunchy iceberg lettuce for burgers and salads.', price_per_kg: 2.99, image_url: '/images/products/iceberg.jpg', stock_quantity: 150, seller_name: 'Cool Farms', category: 'Leafy Greens' },
  { name: 'Bok Choy', description: 'Baby bok choy, perfect for stir-fries and Asian cuisine.', price_per_kg: 5.99, image_url: '/images/products/bokchoy.jpg', stock_quantity: 85, seller_name: 'Asian Garden Fresh', category: 'Leafy Greens' },

  // Root Vegetables
  { name: 'Organic Carrots', description: 'Sweet and crunchy carrots, freshly harvested. Great for snacking or cooking.', price_per_kg: 2.99, image_url: '/images/products/carrots.jpg', stock_quantity: 200, seller_name: 'Root Valley Farm', category: 'Root Vegetables' },
  { name: 'Red Beets', description: 'Earthy red beets, perfect for roasting or juicing.', price_per_kg: 3.49, image_url: '/images/products/beets.jpg', stock_quantity: 100, seller_name: 'Ruby Root Farms', category: 'Root Vegetables' },
  { name: 'Sweet Potatoes', description: 'Orange-fleshed sweet potatoes, naturally sweet and nutritious.', price_per_kg: 2.79, image_url: '/images/products/sweetpotato.jpg', stock_quantity: 180, seller_name: 'Southern Harvest', category: 'Root Vegetables' },
  { name: 'Russet Potatoes', description: 'Classic baking potatoes with fluffy texture when cooked.', price_per_kg: 1.99, image_url: '/images/products/russet.jpg', stock_quantity: 250, seller_name: 'Idaho Farms', category: 'Root Vegetables' },
  { name: 'Red Potatoes', description: 'Waxy red potatoes, ideal for roasting and potato salads.', price_per_kg: 2.49, image_url: '/images/products/redpotato.jpg', stock_quantity: 200, seller_name: 'Valley Spuds', category: 'Root Vegetables' },
  { name: 'Parsnips', description: 'Sweet parsnips, excellent for roasting alongside other root vegetables.', price_per_kg: 4.29, image_url: '/images/products/parsnips.jpg', stock_quantity: 75, seller_name: 'Heritage Roots', category: 'Root Vegetables' },
  { name: 'Turnips', description: 'Mild turnips with a subtle peppery flavor.', price_per_kg: 2.99, image_url: '/images/products/turnips.jpg', stock_quantity: 90, seller_name: 'Farm Fresh Direct', category: 'Root Vegetables' },
  { name: 'Radishes', description: 'Crisp red radishes with a peppery bite, great for salads.', price_per_kg: 3.99, image_url: '/images/products/radishes.jpg', stock_quantity: 110, seller_name: 'Quick Crops', category: 'Root Vegetables' },

  // Alliums
  { name: 'Yellow Onions', description: 'Versatile yellow onions, a kitchen staple for countless recipes.', price_per_kg: 1.49, image_url: '/images/products/yellowonion.jpg', stock_quantity: 300, seller_name: 'Allium Valley', category: 'Alliums' },
  { name: 'Red Onions', description: 'Mild red onions, perfect for salads and grilling.', price_per_kg: 1.99, image_url: '/images/products/redonion.jpg', stock_quantity: 200, seller_name: 'Allium Valley', category: 'Alliums' },
  { name: 'Fresh Garlic', description: 'Aromatic garlic bulbs, essential for any savory dish.', price_per_kg: 8.99, image_url: '/images/products/garlic.jpg', stock_quantity: 150, seller_name: 'Garlic Grove', category: 'Alliums' },
  { name: 'Leeks', description: 'Mild and sweet leeks, wonderful in soups and gratins.', price_per_kg: 4.99, image_url: '/images/products/leeks.jpg', stock_quantity: 80, seller_name: 'Welsh Gardens', category: 'Alliums' },
  { name: 'Green Onions', description: 'Fresh scallions for garnishing and Asian dishes.', price_per_kg: 5.99, image_url: '/images/products/greenonion.jpg', stock_quantity: 100, seller_name: 'Spring Farm', category: 'Alliums' },
  { name: 'Shallots', description: 'Delicate shallots with a mild, sweet flavor.', price_per_kg: 7.99, image_url: '/images/products/shallots.jpg', stock_quantity: 70, seller_name: 'French Gardens', category: 'Alliums' },

  // Cruciferous
  { name: 'Broccoli', description: 'Fresh broccoli crowns, packed with vitamins and fiber.', price_per_kg: 3.99, image_url: '/images/products/broccoli.jpg', stock_quantity: 120, seller_name: 'Green Crown Farms', category: 'Cruciferous' },
  { name: 'Cauliflower', description: 'White cauliflower heads, versatile for roasting, mashing, or rice.', price_per_kg: 3.49, image_url: '/images/products/cauliflower.jpg', stock_quantity: 100, seller_name: 'Cloud Nine Produce', category: 'Cruciferous' },
  { name: 'Brussels Sprouts', description: 'Tender Brussels sprouts, amazing when roasted with bacon.', price_per_kg: 4.99, image_url: '/images/products/brussels.jpg', stock_quantity: 90, seller_name: 'Belgian Harvest', category: 'Cruciferous' },
  { name: 'Green Cabbage', description: 'Crunchy green cabbage for coleslaw, stir-fries, and sauerkraut.', price_per_kg: 1.99, image_url: '/images/products/greencabbage.jpg', stock_quantity: 130, seller_name: 'Cabbage Patch Farm', category: 'Cruciferous' },
  { name: 'Red Cabbage', description: 'Vibrant red cabbage, perfect for colorful salads and braising.', price_per_kg: 2.49, image_url: '/images/products/redcabbage.jpg', stock_quantity: 100, seller_name: 'Cabbage Patch Farm', category: 'Cruciferous' },
  { name: 'Napa Cabbage', description: 'Tender Napa cabbage for kimchi and Asian salads.', price_per_kg: 3.29, image_url: '/images/products/napacabbage.jpg', stock_quantity: 85, seller_name: 'Asian Garden Fresh', category: 'Cruciferous' },

  // Peppers & Tomatoes
  { name: 'Red Bell Peppers', description: 'Sweet red bell peppers, perfect for roasting and stuffing.', price_per_kg: 5.99, image_url: '/images/products/redpepper.jpg', stock_quantity: 100, seller_name: 'Pepper Paradise', category: 'Peppers' },
  { name: 'Green Bell Peppers', description: 'Crisp green bell peppers for salads and fajitas.', price_per_kg: 3.99, image_url: '/images/products/greenpepper.jpg', stock_quantity: 120, seller_name: 'Pepper Paradise', category: 'Peppers' },
  { name: 'Yellow Bell Peppers', description: 'Sweet yellow peppers, great for snacking and cooking.', price_per_kg: 5.49, image_url: '/images/products/yellowpepper.jpg', stock_quantity: 90, seller_name: 'Sunshine Produce', category: 'Peppers' },
  { name: 'Jalapeño Peppers', description: 'Spicy jalapeños for salsas and Mexican dishes.', price_per_kg: 6.99, image_url: '/images/products/jalapeno.jpg', stock_quantity: 80, seller_name: 'Hot Pepper Farm', category: 'Peppers' },
  { name: 'Cherry Tomatoes', description: 'Sweet cherry tomatoes, perfect for snacking and salads.', price_per_kg: 5.99, image_url: '/images/products/cherrytomato.jpg', stock_quantity: 110, seller_name: 'Vine Ripe Farms', category: 'Tomatoes' },
  { name: 'Roma Tomatoes', description: 'Meaty Roma tomatoes, ideal for sauces and cooking.', price_per_kg: 3.99, image_url: '/images/products/roma.jpg', stock_quantity: 140, seller_name: 'Italian Gardens', category: 'Tomatoes' },
  { name: 'Beefsteak Tomatoes', description: 'Large slicing tomatoes for sandwiches and burgers.', price_per_kg: 4.49, image_url: '/images/products/beefsteak.jpg', stock_quantity: 100, seller_name: 'Big Boy Farms', category: 'Tomatoes' },
  { name: 'Heirloom Tomatoes', description: 'Colorful heirloom varieties with exceptional flavor.', price_per_kg: 7.99, image_url: '/images/products/heirloom.jpg', stock_quantity: 60, seller_name: 'Heritage Seeds', category: 'Tomatoes' },

  // Squash & Gourds
  { name: 'Zucchini', description: 'Tender green zucchini, great for grilling and spiralizing.', price_per_kg: 3.49, image_url: '/images/products/zucchini.jpg', stock_quantity: 120, seller_name: 'Summer Squash Farm', category: 'Squash' },
  { name: 'Yellow Squash', description: 'Mild yellow squash, perfect for summer dishes.', price_per_kg: 3.49, image_url: '/images/products/yellowsquash.jpg', stock_quantity: 110, seller_name: 'Summer Squash Farm', category: 'Squash' },
  { name: 'Butternut Squash', description: 'Sweet butternut squash, wonderful for soups and roasting.', price_per_kg: 2.99, image_url: '/images/products/butternut.jpg', stock_quantity: 90, seller_name: 'Autumn Harvest', category: 'Squash' },
  { name: 'Acorn Squash', description: 'Decorative acorn squash with sweet, nutty flesh.', price_per_kg: 2.79, image_url: '/images/products/acorn.jpg', stock_quantity: 80, seller_name: 'Autumn Harvest', category: 'Squash' },
  { name: 'Spaghetti Squash', description: 'Unique squash with stringy flesh, perfect pasta substitute.', price_per_kg: 3.29, image_url: '/images/products/spaghetti.jpg', stock_quantity: 70, seller_name: 'Healthy Choice Farm', category: 'Squash' },
  { name: 'Cucumber', description: 'Cool crisp cucumbers, refreshing for salads and snacking.', price_per_kg: 2.99, image_url: '/images/products/cucumber.jpg', stock_quantity: 150, seller_name: 'Cool Cucumber Co.', category: 'Squash' },

  // Beans & Peas
  { name: 'Green Beans', description: 'Tender green beans, perfect for steaming or sautéing.', price_per_kg: 4.49, image_url: '/images/products/greenbeans.jpg', stock_quantity: 100, seller_name: 'Bean Valley', category: 'Beans & Peas' },
  { name: 'Snow Peas', description: 'Crisp snow peas for stir-fries and Asian dishes.', price_per_kg: 6.99, image_url: '/images/products/snowpeas.jpg', stock_quantity: 70, seller_name: 'Asian Garden Fresh', category: 'Beans & Peas' },
  { name: 'Sugar Snap Peas', description: 'Sweet and crunchy snap peas, great for snacking.', price_per_kg: 7.49, image_url: '/images/products/snappeas.jpg', stock_quantity: 65, seller_name: 'Sweet Pod Farm', category: 'Beans & Peas' },
  { name: 'Edamame', description: 'Fresh soybeans in pods, a healthy protein-rich snack.', price_per_kg: 5.99, image_url: '/images/products/edamame.jpg', stock_quantity: 80, seller_name: 'Asian Garden Fresh', category: 'Beans & Peas' },

  // Other Vegetables
  { name: 'Fresh Corn', description: 'Sweet corn on the cob, perfect for grilling or boiling.', price_per_kg: 3.99, image_url: '/images/products/corn.jpg', stock_quantity: 0, seller_name: 'Cornfield Farms', category: 'Other' },
  { name: 'Artichokes', description: 'Globe artichokes, a delicious gourmet treat when steamed.', price_per_kg: 8.99, image_url: '/images/products/artichoke.jpg', stock_quantity: 40, seller_name: 'Mediterranean Gardens', category: 'Other' },
  { name: 'Asparagus', description: 'Tender asparagus spears, elegant when grilled or roasted.', price_per_kg: 7.99, image_url: '/images/products/asparagus.jpg', stock_quantity: 60, seller_name: 'Spring Harvest', category: 'Other' },
  { name: 'Celery', description: 'Crisp celery stalks, great for snacking with dip or in soups.', price_per_kg: 2.49, image_url: '/images/products/celery.jpg', stock_quantity: 130, seller_name: 'Crunchy Farms', category: 'Other' },
  { name: 'Eggplant', description: 'Purple Italian eggplant, perfect for grilling and baba ganoush.', price_per_kg: 3.99, image_url: '/images/products/eggplant.jpg', stock_quantity: 85, seller_name: 'Mediterranean Gardens', category: 'Other' },
];

/**
 * Seed the database with initial data
 * Inserts countries and products if tables are empty
 */
export function seedDatabase(): void {
  const db = getDb();

  // Initialize schema first
  initializeSchema();

  // Check if countries already exist
  const countryCount = db.prepare('SELECT COUNT(*) as count FROM countries').get() as { count: number };
  
  if (countryCount.count === 0) {
    const insertCountry = db.prepare(
      'INSERT INTO countries (code, name, phone_code) VALUES (?, ?, ?)'
    );

    const insertManyCountries = db.transaction((items: typeof countries) => {
      for (const country of items) {
        insertCountry.run(country.code, country.name, country.phone_code);
      }
    });

    insertManyCountries(countries);
    console.log(`Seeded ${countries.length} countries`);
  }

  // Check if products already exist
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (name, description, price_per_kg, image_url, stock_quantity, in_stock, seller_name, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertManyProducts = db.transaction((items: typeof products) => {
      for (const product of items) {
        insertProduct.run(
          product.name,
          product.description,
          product.price_per_kg,
          product.image_url,
          product.stock_quantity,
          product.stock_quantity > 0 ? 1 : 0,
          product.seller_name,
          product.category
        );
      }
    });

    insertManyProducts(products);
    console.log(`Seeded ${products.length} products`);
  }

  console.log('Database seeding completed');
}

export default seedDatabase;
