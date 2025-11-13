# 🚀 EISHRO Backend API

Production-ready Express.js backend for EISHRO E-commerce platform.

## ✨ Features

- ✅ **Express.js + TypeScript** - Type-safe, scalable API
- ✅ **Sequelize ORM** - MySQL database with migrations
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **RBAC Authorization** - Role-based access control
- ✅ **Moamalat Payment Gateway** - Integrated payment processing
- ✅ **Comprehensive Logging** - Winston-based logging system
- ✅ **Input Validation** - Joi schema validation
- ✅ **Error Handling** - Centralized error management
- ✅ **CORS** - Cross-origin request handling
- ✅ **Security** - Helmet, rate limiting, bcrypt hashing

## 📋 Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL 5.7+

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eishro_db
JWT_SECRET=your_secret_key
MOAMALAT_MID=your_mid
MOAMALAT_TID=your_tid
MOAMALAT_SECRET=your_secret
```

### 3. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE eishro_db;"

# Run migrations
npm run db:migrate

# (Optional) Seed data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - User login
POST   /api/auth/logout       - User logout
POST   /api/auth/refresh      - Refresh JWT token
```

### Product Endpoints

```
GET    /api/products          - Get all products
GET    /api/products/:id      - Get product details
POST   /api/products          - Create product (merchant/admin)
PUT    /api/products/:id      - Update product (merchant/admin)
DELETE /api/products/:id      - Delete product (merchant/admin)
```

### Order Endpoints

```
POST   /api/orders            - Create new order
GET    /api/orders/:id        - Get order details
GET    /api/orders/user/:id   - Get user's orders
PUT    /api/orders/:id        - Update order
```

### Payment Endpoints

```
POST   /api/payments/moamalat/hash      - Generate Moamalat hash (CRITICAL)
GET    /api/payments/moamalat/config    - Get Moamalat config
POST   /api/payments/moamalat/verify    - Verify payment
```

### Coupon Endpoints

```
POST   /api/coupons/validate  - Validate coupon code
GET    /api/coupons/:code     - Get coupon details
```

### Admin Endpoints

```
GET    /api/admin/dashboard           - Dashboard statistics
GET    /api/admin/users               - List all users
GET    /api/admin/orders              - List all orders
GET    /api/admin/products            - List all products
```

## 🔒 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Roles

- **customer** - Regular user
- **merchant** - Store owner
- **admin** - System administrator

## 🏗️ Project Structure

```
src/
├── config/           - Database & environment configuration
├── models/           - Sequelize ORM models
├── controllers/      - Route handlers
├── services/         - Business logic
├── routes/           - API routes
├── middleware/       - Authentication, validation, errors
├── validators/       - Joi validation schemas
├── utils/            - Utilities & helpers
├── types/            - TypeScript interfaces
└── index.ts          - Application entry point
```

## 📝 Scripts

```bash
# Development
npm run dev           # Start dev server with auto-reload

# Production
npm run build         # Build TypeScript
npm start             # Start production server

# Quality
npm run typecheck     # Type checking
npm run lint          # Linting
npm test              # Run tests

# Database
npm run db:migrate    # Run migrations
npm run db:seed       # Seed sample data
```

## 🔐 Security

- **HTTPS only** - Enforce SSL/TLS in production
- **JWT tokens** - Stateless authentication
- **Password hashing** - bcryptjs with 10 rounds
- **Input validation** - Joi schemas on all endpoints
- **CORS configured** - Restricted to frontend domain
- **Helmet headers** - Security headers protection
- **Rate limiting** - Prevent abuse
- **Error messages** - No sensitive data exposed

## 🌍 Deployment

### Railway

1. Push to GitHub
2. Connect Railway to your GitHub repo
3. Add MySQL database
4. Set environment variables
5. Deploy

```bash
# Railway CLI
railway up
```

### Environment Variables in Production

See `.env.example` for all variables. Critical ones:

- `JWT_SECRET` - Strong random string
- `MOAMALAT_SECRET` - Payment gateway secret
- `DB_PASSWORD` - Strong database password
- `FRONTEND_URL` - Production frontend domain

## 📊 Database

### Tables

- **users** - User accounts with roles
- **products** - Product catalog
- **stores** - Merchant stores
- **orders** - Customer orders
- **order_items** - Order line items
- **coupons** - Discount codes
- **payments** - Payment records
- **user_addresses** - Delivery addresses
- **product_images** - Product media

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:** Ensure MySQL is running and credentials are correct in `.env`

### JWT Token Invalid

```
Error: Invalid token
```

**Solution:** Check JWT_SECRET is set and token hasn't expired

### Payment Gateway Error

```
Error: Failed to generate hash
```

**Solution:** Verify MOAMALAT credentials and environment in `.env`

## 📞 Support

- 📧 Email: support@eishro.ly
- 💬 Discord: [Join Server](https://discord.gg/eishro)
- 📖 Docs: [GitHub Docs](./docs)

## 📄 License

MIT © 2025 EISHRO Team

---

**Next Steps:**
1. ✅ Configure `.env`
2. ✅ Setup database
3. ✅ Run `npm run dev`
4. ✅ Test endpoints with Postman
5. ✅ Deploy to Railway
