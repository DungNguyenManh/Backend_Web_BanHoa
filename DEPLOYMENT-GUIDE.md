# Hướng dẫn Deploy Flower Shop Backend lên Vercel

## 🚀 Bước 1: Chuẩn bị deploy

### 1.1 Kiểm tra cấu hình

- ✅ File `vercel.json` đã được cấu hình
- ✅ Script `vercel-build` đã được thêm vào `package.json`
- ✅ CORS đã được cấu hình trong `main.ts`
- ✅ Database connection sử dụng biến môi trường

### 1.2 Tạo file `.env` local (để test)

```bash
# Copy từ .env.example
cp .env.example .env
```

Cập nhật các giá trị thực tế trong `.env`:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flower-shop?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Server Port
PORT=3000
```

## 🚀 Bước 2: Deploy lên Vercel

### Cách 1: Sử dụng GitHub (Khuyến nghị)

1. **Push code lên GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - Flower Shop Backend"
git branch -M main
git remote add origin https://github.com/yourusername/flower-shop-backend.git
git push -u origin main
```

2. **Truy cập Vercel Dashboard:**
   - Vào https://vercel.com/dashboard
   - Đăng nhập bằng GitHub
   - Click "New Project"
   - Import repository từ GitHub

3. **Cấu hình deployment:**
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Cách 2: Sử dụng Vercel CLI

1. **Cài đặt Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login và deploy:**
```bash
vercel login
vercel --prod
```

## 🔧 Bước 3: Cấu hình Environment Variables trên Vercel

Trên Vercel Dashboard → Settings → Environment Variables, thêm:

### Required Variables:
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/flower-shop?retryWrites=true&w=majority
JWT_SECRET = your-super-secret-jwt-key-minimum-32-characters
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
```

### Optional Variables:
```
MAIL_HOST = smtp.gmail.com
MAIL_USER = your-email@gmail.com
MAIL_PASSWORD = your-app-password
MAIL_FROM = your-email@gmail.com
FRONTEND_URL = https://your-frontend-domain.vercel.app
PORT = 3000
NODE_ENV = production
```

## 📋 Bước 4: Kiểm tra deployment

### 4.1 Kiểm tra build logs
- Vào Vercel Dashboard → Functions → View Function Logs
- Kiểm tra có lỗi gì không

### 4.2 Test API endpoints
Sử dụng Postman hoặc curl để test:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Get all flowers
curl https://your-app.vercel.app/api/flowers

# Register user
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'

# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Upload flower (with JWT token)
curl -X POST https://your-app.vercel.app/api/flowers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Rose" \
  -F "description=Beautiful red rose" \
  -F "price=25000" \
  -F "category=66b9a..." \
  -F "images=@/path/to/image.jpg"
```

## 🔧 Bước 5: Cấu hình CORS cho production

Cập nhật CORS trong `src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',     // React/Next.js local
    'http://localhost:5173',     // Vite local
    'https://your-frontend-domain.vercel.app', // Production frontend
    'https://flower-shop-frontend.vercel.app', // Thay bằng domain thực tế
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

## 🚨 Troubleshooting

### 1. Build failed
```bash
# Kiểm tra dependencies
npm install
npm run build

# Kiểm tra TypeScript errors
npx tsc --noEmit
```

### 2. Database connection error
- Kiểm tra MongoDB URI có đúng format không
- Kiểm tra whitelist IP trên MongoDB Atlas
- Kiểm tra user permissions

### 3. Cloudinary upload error
- Kiểm tra API credentials
- Kiểm tra network permissions
- Kiểm tra file size limits

### 4. CORS error
- Cập nhật origin URLs trong `main.ts`
- Redeploy sau khi thay đổi

## 📊 Monitoring và Logs

### Vercel Analytics
- Vào Vercel Dashboard → Analytics
- Theo dõi traffic, performance

### Function Logs
- Vào Vercel Dashboard → Functions → View Function Logs
- Xem real-time logs

### Error Tracking
Có thể tích hợp Sentry:
```bash
npm install @sentry/node
```

## 🔄 CI/CD Pipeline

### Auto-deploy từ GitHub
1. Connect repository với Vercel
2. Mỗi khi push lên main branch → auto deploy
3. Preview deployments cho Pull Requests

### Build optimization
```json
// package.json
{
  "scripts": {
    "vercel-build": "npm run build && npm prune --production"
  }
}
```

## 📝 Notes

1. **Vercel Functions có giới hạn:**
   - Execution time: 10s (Hobby), 15s (Pro)
   - Memory: 1024MB (Hobby), 3GB (Pro)
   - File size: 50MB

2. **Cold start:**
   - Functions có thể bị cold start
   - Cân nhắc keep-alive strategy

3. **Database connections:**
   - Sử dụng connection pooling
   - Tránh tạo quá nhiều connections

4. **File uploads:**
   - Vercel không hỗ trợ lưu file persistent
   - Phải dùng Cloudinary/AWS S3

## 🎯 Production Checklist

- [ ] Environment variables đã được cấu hình
- [ ] Database đã setup (MongoDB Atlas)
- [ ] Cloudinary đã cấu hình
- [ ] CORS đã cấu hình đúng domain
- [ ] JWT secret đủ mạnh
- [ ] Email service đã test
- [ ] API endpoints đã test
- [ ] Error handling đã implement
- [ ] Logs đã cấu hình
- [ ] Security headers đã thêm
- [ ] Rate limiting đã enable (nếu cần)

**🎉 Sau khi hoàn thành các bước trên, backend sẽ được deploy thành công lên Vercel!**
