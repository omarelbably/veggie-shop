# VeggieShop - API Documentation

## Base URL
All API endpoints are relative to: `/api`

## Authentication
Authentication is handled via HTTP-only cookies containing JWT tokens.

---

## Auth Endpoints

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "countryId": 1,
  "mobileNumber": "1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Logout
```
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true
}
```

---

### Get Current User
```
GET /api/auth/me
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "countryId": 1,
    "mobileNumber": "1234567890"
  }
}
```

---

## Product Endpoints

### Get All Products
```
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by name/description |
| category | string | Filter by category |
| sort | string | Sort field (name, price_per_kg) |
| order | string | Sort order (asc, desc) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 12) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "total": 50,
    "page": 1,
    "limit": 12,
    "totalPages": 5
  }
}
```

---

### Get Product by ID
```
GET /api/products/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Fresh Tomatoes",
    "description": "...",
    "price_per_kg": 2.99,
    "image_url": "/images/tomato.jpg",
    "stock_quantity": 100,
    "in_stock": 1,
    "seller_name": "Green Farm",
    "category": "Nightshades"
  }
}
```

---

### Get Categories
```
GET /api/products/categories
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    "Leafy Greens",
    "Root Vegetables",
    "Cruciferous",
    "Alliums",
    "Nightshades",
    "Legumes",
    "Squash",
    "Herbs"
  ]
}
```

---

## Cart Endpoints

### Get User's Cart
```
GET /api/cart
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "product": {
          "id": 1,
          "name": "Fresh Tomatoes",
          "price_per_kg": 2.99,
          "image_url": "/images/tomato.jpg",
          "in_stock": 1
        }
      }
    ],
    "totalItems": 2,
    "totalPrice": 5.98
  }
}
```

---

### Add to Cart
```
POST /api/cart
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalItems": 2,
    "totalPrice": 5.98
  }
}
```

---

### Update Cart Item Quantity
```
PUT /api/cart/:productId
```

**Request Body:**
```json
{
  "quantity": 5
}
```

---

### Remove from Cart
```
DELETE /api/cart/:productId
```

---

## Wishlist Endpoints

### Get Wishlist
```
GET /api/wishlist
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "product": {
        "id": 1,
        "name": "Fresh Tomatoes",
        "price_per_kg": 2.99,
        ...
      }
    }
  ]
}
```

---

### Add to Wishlist
```
POST /api/wishlist
```

**Request Body:**
```json
{
  "productId": 1
}
```

---

### Remove from Wishlist
```
DELETE /api/wishlist/:productId
```

---

### Move to Cart
```
POST /api/wishlist/:productId/move-to-cart
```

**Request Body:**
```json
{
  "quantity": 1
}
```

---

## Order Endpoints

### Get User's Orders
```
GET /api/orders
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "total_amount": 25.99,
      "status": "pending",
      "delivery_address": "123 Main St...",
      "estimated_delivery": "2024-01-20",
      "created_at": "2024-01-15T10:30:00Z",
      "items": [...]
    }
  ]
}
```

---

### Create Order
```
POST /api/orders
```

**Request Body:**
```json
{
  "deliveryAddress": "123 Main St, City, State 12345"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total_amount": 25.99,
    "status": "pending",
    "estimated_delivery": "2024-01-20"
  }
}
```

---

### Get Order by ID
```
GET /api/orders/:id
```

---

## Country Endpoints

### Get All Countries
```
GET /api/countries
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "United States",
      "code": "US",
      "phone_code": "+1"
    },
    ...
  ]
}
```

---

## Initialize Database

### Seed Database
```
POST /api/init
```

Seeds the database with initial data (countries and products).

**Response (200):**
```json
{
  "success": true,
  "message": "Database seeded successfully"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |
