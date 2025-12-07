# VeggieShop - Database Documentation

## Overview

VeggieShop uses SQLite as its database with the `better-sqlite3` driver for Node.js. The database follows a relational model with proper foreign key relationships and constraints.

## Database Configuration

- **Database Type:** SQLite
- **Driver:** better-sqlite3
- **File Location:** `./veggieshop.db`
- **Mode:** WAL (Write-Ahead Logging) for better concurrency
- **Foreign Keys:** Enabled

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    countries    │     │      users       │     │    products     │
├─────────────────┤     ├──────────────────┤     ├─────────────────┤
│ PK id           │     │ PK id            │     │ PK id           │
│    name         │◄────┤ FK country_id    │     │    name         │
│    code         │     │    email         │     │    description  │
│    phone_code   │     │    password_hash │     │    price_per_kg │
│    created_at   │     │    first_name    │     │    image_url    │
└─────────────────┘     │    last_name     │     │    stock_qty    │
                        │    mobile_number │     │    in_stock     │
                        │    created_at    │     │    seller_name  │
                        │    updated_at    │     │    category     │
                        └────────┬─────────┘     │    created_at   │
                                 │               │    updated_at   │
                                 │               └────────┬────────┘
                 ┌───────────────┼───────────────┐        │
                 │               │               │        │
                 ▼               ▼               ▼        ▼
        ┌────────────────┐ ┌────────────────┐ ┌─────────────────────┐
        │   cart_items   │ │ wishlist_items │ │       orders        │
        ├────────────────┤ ├────────────────┤ ├─────────────────────┤
        │ PK id          │ │ PK id          │ │ PK id               │
        │ FK user_id     │ │ FK user_id     │ │ FK user_id          │
        │ FK product_id  │ │ FK product_id  │ │    total_amount     │
        │    quantity    │ │    created_at  │ │    status           │
        │    created_at  │ └────────────────┘ │    delivery_address │
        │    updated_at  │                    │    estimated_delivery│
        └────────────────┘                    │    created_at       │
                                              │    updated_at       │
                                              └──────────┬──────────┘
                                                         │
                                                         ▼
                                              ┌─────────────────────┐
                                              │    order_items      │
                                              ├─────────────────────┤
                                              │ PK id               │
                                              │ FK order_id         │
                                              │ FK product_id       │
                                              │    quantity         │
                                              │    price_at_purchase│
                                              │    created_at       │
                                              └─────────────────────┘
```

## Tables Description

### 1. countries
Stores country information for user registration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| name | TEXT | NOT NULL | Country name (e.g., "United States") |
| code | TEXT | NOT NULL, UNIQUE | ISO country code (e.g., "US") |
| phone_code | TEXT | NOT NULL | Phone country code (e.g., "+1") |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- `idx_countries_code` on `code`

### 2. users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| country_id | INTEGER | FOREIGN KEY → countries(id) | User's country |
| email | TEXT | NOT NULL, UNIQUE | User email address |
| password_hash | TEXT | NOT NULL | Bcrypt hashed password |
| first_name | TEXT | NOT NULL | User's first name |
| last_name | TEXT | NOT NULL | User's last name |
| mobile_number | TEXT | | User's mobile number |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_users_email` on `email`

### 3. products
Stores product catalog information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| name | TEXT | NOT NULL | Product name |
| description | TEXT | | Product description |
| price_per_kg | REAL | NOT NULL | Price per kilogram |
| image_url | TEXT | | Product image URL |
| stock_quantity | INTEGER | NOT NULL, DEFAULT 100 | Available stock in kg |
| in_stock | INTEGER | NOT NULL, DEFAULT 1 | Stock status (0/1) |
| seller_name | TEXT | NOT NULL | Seller/vendor name |
| category | TEXT | NOT NULL | Product category |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_products_category` on `category`
- `idx_products_in_stock` on `in_stock`

### 4. cart_items
Stores shopping cart items for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Cart owner |
| product_id | INTEGER | NOT NULL, FOREIGN KEY → products(id) | Product in cart |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Quantity in kg |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | When added to cart |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last quantity update |

**Constraints:**
- `UNIQUE(user_id, product_id)` - One cart entry per product per user
- `ON DELETE CASCADE` - Removes cart items when user/product deleted

**Indexes:**
- `idx_cart_user` on `user_id`

### 5. wishlist_items
Stores saved items for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Wishlist owner |
| product_id | INTEGER | NOT NULL, FOREIGN KEY → products(id) | Saved product |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | When added |

**Constraints:**
- `UNIQUE(user_id, product_id)` - One wishlist entry per product per user
- `ON DELETE CASCADE` - Removes items when user/product deleted

**Indexes:**
- `idx_wishlist_user` on `user_id`

### 6. orders
Stores order information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Order number |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Customer |
| total_amount | REAL | NOT NULL | Total order value |
| status | TEXT | NOT NULL, DEFAULT 'pending' | Order status |
| delivery_address | TEXT | NOT NULL | Shipping address |
| estimated_delivery | TEXT | | Expected delivery date |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Order placement time |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last status update |

**Status Values:** pending, processing, shipped, delivered, cancelled

**Indexes:**
- `idx_orders_user` on `user_id`
- `idx_orders_status` on `status`

### 7. order_items
Stores individual items within orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| order_id | INTEGER | NOT NULL, FOREIGN KEY → orders(id) | Parent order |
| product_id | INTEGER | NOT NULL, FOREIGN KEY → products(id) | Ordered product |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| price_at_purchase | REAL | NOT NULL | Price at time of order |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Constraints:**
- `ON DELETE CASCADE` - Removes items when order deleted

**Indexes:**
- `idx_order_items_order` on `order_id`

## Data Flow Diagram (DFD) - Level 0 (Context Diagram)

```
                                    ┌─────────────────────┐
                                    │                     │
              Registration          │                     │
              Login/Logout ───────► │                     │
              Browse Products       │                     │
              Search/Filter  ─────► │    VeggieShop      │
              Add to Cart    ─────► │      System         │
    User      Add to Wishlist────►  │                     │
              Checkout       ─────► │                     │
              View Orders    ─────► │                     │
                                    │                     │
              ◄─────────────────────│                     │
              Product List          │                     │
              Cart Summary          │                     │
              Order Confirmation    └─────────────────────┘
              Order History                    │
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │     Database        │
                                    │     (SQLite)        │
                                    └─────────────────────┘
```

## DFD - Level 1

```
                                          ┌───────────────────┐
                                          │                   │
        ┌─────────────────────────────────┤  1.0 User Auth    │
        │ Registration/Login              │    Management     │
        │                                 └─────────┬─────────┘
        │                                           │
        │                                           │ User Data
        ▼                                           ▼
   ┌─────────┐                            ┌─────────────────┐
   │         │                            │                 │
   │  User   │ ◄───────────────────────── │    D1: Users    │
   │         │     User Info              │                 │
   └────┬────┘                            └─────────────────┘
        │
        │ Product Query     ┌───────────────────┐
        ├─────────────────► │                   │
        │                   │  2.0 Product      │
        │ ◄─────────────────┤    Catalog        │
        │ Product List      │                   │
        │                   └─────────┬─────────┘
        │                             │
        │                             │ Product Data
        │                             ▼
        │                   ┌─────────────────┐
        │                   │                 │
        │                   │  D2: Products   │
        │                   │                 │
        │                   └─────────────────┘
        │
        │ Add/Remove Items  ┌───────────────────┐
        ├─────────────────► │                   │
        │                   │  3.0 Cart         │
        │ ◄─────────────────┤    Management     │
        │ Cart Contents     │                   │
        │                   └─────────┬─────────┘
        │                             │
        │                             │ Cart Data
        │                             ▼
        │                   ┌─────────────────┐
        │                   │                 │
        │                   │ D3: Cart Items  │
        │                   │                 │
        │                   └─────────────────┘
        │
        │ Save/Move Items   ┌───────────────────┐
        ├─────────────────► │                   │
        │                   │  4.0 Wishlist     │
        │ ◄─────────────────┤    Management     │
        │ Wishlist Contents │                   │
        │                   └─────────┬─────────┘
        │                             │
        │                             │ Wishlist Data
        │                             ▼
        │                   ┌─────────────────┐
        │                   │                 │
        │                   │D4: Wishlist Items│
        │                   │                 │
        │                   └─────────────────┘
        │
        │ Place Order       ┌───────────────────┐
        ├─────────────────► │                   │
        │                   │  5.0 Order        │
        │ ◄─────────────────┤    Processing     │
        │ Order Confirmation│                   │
        │                   └─────────┬─────────┘
        │                             │
        │                             │ Order Data
        │                             ▼
        │                   ┌─────────────────┐
        │                   │                 │
        │                   │   D5: Orders    │
        │                   │                 │
        │                   └─────────────────┘
```

## Database Relationships

### One-to-Many Relationships

1. **countries → users**: One country can have many users
2. **users → cart_items**: One user can have many cart items
3. **users → wishlist_items**: One user can have many wishlist items
4. **users → orders**: One user can have many orders
5. **products → cart_items**: One product can be in many carts
6. **products → wishlist_items**: One product can be in many wishlists
7. **products → order_items**: One product can be in many order items
8. **orders → order_items**: One order can have many order items

### Cardinality Summary

| Relationship | Cardinality |
|--------------|-------------|
| User - Cart Items | 1:N |
| User - Wishlist Items | 1:N |
| User - Orders | 1:N |
| Product - Cart Items | 1:N |
| Product - Order Items | 1:N |
| Order - Order Items | 1:N |
| Country - Users | 1:N |

## Seed Data

The database is pre-seeded with:

- **40 Countries** with phone codes for registration
- **50 Vegetable Products** across 8 categories:
  - Leafy Greens
  - Root Vegetables
  - Cruciferous
  - Alliums
  - Nightshades
  - Legumes
  - Squash
  - Herbs

## SQL Queries Examples

### Get User's Cart with Product Details
```sql
SELECT 
  ci.id,
  ci.quantity,
  p.id as product_id,
  p.name,
  p.price_per_kg,
  p.image_url,
  p.in_stock
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = ?
```

### Get Order with Items
```sql
SELECT 
  o.*,
  oi.id as item_id,
  oi.quantity,
  oi.price_at_purchase,
  p.name as product_name,
  p.image_url
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.id = ?
```

### Search Products
```sql
SELECT * FROM products
WHERE (name LIKE ? OR description LIKE ?)
  AND (category = ? OR ? IS NULL)
  AND in_stock = 1
ORDER BY name ASC
LIMIT ? OFFSET ?
```

## Performance Considerations

1. **WAL Mode**: Enables concurrent reads during writes
2. **Indexes**: Created on frequently queried columns
3. **Cascade Deletes**: Maintains referential integrity automatically
4. **Unique Constraints**: Prevents duplicate cart/wishlist entries
5. **Timestamps**: Automatic creation and update tracking

## Security Measures

1. **Password Hashing**: Using bcrypt with salt rounds
2. **Parameterized Queries**: All SQL uses prepared statements
3. **Foreign Key Constraints**: Enforces data integrity
4. **Input Validation**: At repository level before DB operations
