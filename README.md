# 🥬 VeggieShop - Fresh Vegetables E-Commerce Platform

A modern, full-stack e-commerce application for selling fresh vegetables online, built with Next.js, TypeScript, Tailwind CSS, and SQLite.

![VeggieShop](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-green)

## 📋 Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Catalog**: Browse 50+ vegetable products with images and descriptions
- **Search & Filter**: Search by name, filter by category, sort by price/name
- **Shopping Cart**: Add items, update quantities, remove items
- **Wishlist**: Save items for later, move to cart functionality
- **Checkout**: Place orders with delivery address and estimated delivery time
- **Order History**: View past orders with status tracking

### Technical Features
- **Repository Pattern**: Clean data access layer following SOLID principles
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first UI using Tailwind CSS
- **Server-Side API**: RESTful API routes with Next.js App Router
- **Database**: SQLite with better-sqlite3 for high performance
- **Authentication**: JWT tokens with HTTP-only cookies
- **Unit Tests**: Jest and React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd veggie-shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize the database**
The database will be automatically created on first run. To seed it with initial data:
```bash
# Start the dev server first
npm run dev

# Then visit or POST to:
# http://localhost:3000/api/init
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
veggie-shop/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API route handlers
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── cart/          # Cart management
│   │   │   ├── orders/        # Order processing
│   │   │   ├── products/      # Product catalog
│   │   │   └── wishlist/      # Wishlist management
│   │   ├── cart/              # Cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── login/             # Login page
│   │   ├── orders/            # Orders page
│   │   ├── product/[id]/      # Product detail page
│   │   ├── register/          # Registration page
│   │   └── wishlist/          # Wishlist page
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React Context providers
│   ├── lib/                   # Utilities and database
│   │   ├── auth.ts           # JWT authentication
│   │   └── db/               # Database connection & schema
│   ├── repositories/          # Data access layer
│   └── types/                 # TypeScript definitions
├── docs/                      # Documentation
│   ├── API.md                # API documentation
│   └── DATABASE.md           # Database schema & ERD
└── __tests__/                 # Unit tests
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📚 Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Database Documentation](./docs/DATABASE.md) - Schema, ERD, and DFD

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (better-sqlite3) |
| Authentication | JWT (jose) |
| Password Hashing | bcryptjs |
| Testing | Jest, React Testing Library |

## 🔐 Security Features

- Password hashing with bcrypt
- JWT tokens stored in HTTP-only cookies
- Parameterized SQL queries
- Input validation on all endpoints
- CSRF protection via SameSite cookies

## 📊 Database Schema

The application uses 7 tables:
- **users** - User accounts
- **countries** - Country list for registration
- **products** - Product catalog
- **cart_items** - Shopping cart
- **wishlist_items** - Saved items
- **orders** - Order records
- **order_items** - Order line items

See [DATABASE.md](./docs/DATABASE.md) for complete ERD and DFD.

## 🎨 UI/UX Features

- Amazon-inspired design
- Responsive layout for all devices
- Loading states and animations
- Toast notifications
- Form validation with error messages
- Skeleton loading states

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for IGSR Data Analysis and Design Project
