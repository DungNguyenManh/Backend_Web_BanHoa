# 🌸 Flower Shop Backend API

Backend API cho hệ thống quản lý shop hoa được xây dựng bằng NestJS với MongoDB và Cloudinary.

## 🚀 Tính năng chính

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, User)
- Password hashing với bcrypt
- Registration & Login endpoints

### 🌺 Flower Management
- CRUD operations cho flowers
- Upload nhiều ảnh lên Cloudinary
- SEO-friendly image naming
- Category-based organization
- Search & filter functionality

### 📦 Category Management
- Quản lý danh mục hoa
- Hierarchical category structure

### 🛒 Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart data

### 📋 Order Management
- Create & track orders
- Order status updates
- Order history

### 👥 User Management
- User profiles
- User preferences
- Admin user management

### 📧 Email Service
- Transactional emails
- Order confirmations
- Password reset

### 🎯 SEO Support
- Metadata endpoints
- Sitemap generation
- SEO-friendly URLs

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT + Passport
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication & Authorization
│   ├── users/          # User management
│   ├── flowers/        # Flower CRUD & upload
│   ├── categories/     # Category management
│   ├── cart/           # Shopping cart
│   ├── orders/         # Order management
│   └── reviews/        # Review system
├── cloudinary/         # Cloudinary service
├── database/           # Database configuration
├── health/             # Health check endpoints
└── shared/             # Shared utilities
```

## 🔧 Installation & Setup

### 1. Clone repository
```bash
git clone <repository-url>
cd flower-shop-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment setup
```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/flower-shop

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3001
```

### 4. Development
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Deployment Tests
```bash
# Check deployment readiness
npm run pre-deploy

# Test deployed API
npm run test:deployment https://your-app.vercel.app
```

## 🚀 Deployment

### Vercel Deployment

1. **Pre-deployment check:**
```bash
npm run pre-deploy
```

2. **Deploy to Vercel:**
```bash
# Via GitHub (recommended)
git push origin main

# Via Vercel CLI
vercel --prod
```

3. **Environment Variables:**
Cấu hình trên Vercel Dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD`
- `FRONTEND_URL`

Xem chi tiết trong [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

## 📚 API Documentation

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### Flowers
```
GET    /api/flowers              # Get all flowers
GET    /api/flowers/:id          # Get flower by ID
POST   /api/flowers              # Create flower (with image upload)
PUT    /api/flowers/:id          # Update flower
DELETE /api/flowers/:id          # Delete flower
GET    /api/flowers/seo-metadata # SEO metadata
GET    /api/flowers/sitemap      # Sitemap data
```

### Categories
```
GET    /api/categories     # Get all categories
POST   /api/categories     # Create category
PUT    /api/categories/:id # Update category
DELETE /api/categories/:id # Delete category
```

### Cart
```
GET    /api/cart           # Get user cart
POST   /api/cart           # Add to cart
PUT    /api/cart/:id       # Update cart item
DELETE /api/cart/:id       # Remove from cart
```

### Orders
```
GET    /api/orders         # Get user orders
POST   /api/orders         # Create order
PUT    /api/orders/:id     # Update order status
```

### Health Check
```
GET    /api/health         # Health status
GET    /api/health/ping    # Simple ping
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **CORS Configuration**: Proper CORS setup
- **Input Validation**: class-validator for data validation
- **Rate Limiting**: Protection against abuse
- **Environment Variables**: Secure configuration

## 🌟 Key Features

### Image Upload
- **Cloudinary Integration**: Professional image hosting
- **SEO-friendly naming**: Slugified image names
- **Multiple formats**: Support for various image types
- **Automatic optimization**: Cloudinary auto-optimization

### SEO Support
- **Metadata API**: Structured data for search engines
- **Sitemap Generation**: Auto-generated XML sitemap
- **SEO-friendly URLs**: Clean, descriptive URLs

### Performance
- **Database Indexing**: Optimized database queries
- **Caching Strategy**: Efficient data retrieval
- **Pagination**: Large dataset handling

## 📝 API Usage Examples

### Upload Flower with Images (Postman)
```
POST /api/flowers
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

Body (form-data):
- name: "Red Rose"
- description: "Beautiful red rose"
- price: 25000
- category: "66b9a..."
- images: [file1.jpg, file2.jpg]
```

### Get Flowers with Filters
```
GET /api/flowers?category=66b9a...&minPrice=10000&maxPrice=50000&page=1&limit=10
```

## 🔧 Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Swagger**: API documentation
- **TypeScript**: Type safety

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For questions or issues, please contact:
- Email: your-email@example.com
- GitHub: [Your GitHub Profile]

---

**🎉 Happy coding! 🌸**
