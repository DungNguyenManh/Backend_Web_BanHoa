# Test Admin User Creation

## 1. Tạo ADMIN user qua endpoint POST /users (nếu có ADMIN token)
POST http://localhost:3000/users
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
    "email": "admin@flowershop.com",
    "password": "admin123",
    "name": "Admin User",
    "phone": "0123456789", 
    "address": "Admin Address"
}

## 2. Hoặc tạo trực tiếp trong database (MongoDB Compass/CLI)
use your_database_name
db.users.insertOne({
    "email": "admin@flowershop.com",
    "password": "$2a$10$hashPasswordHere", // Hash của "admin123"
    "name": "Admin User", 
    "phone": "0123456789",
    "address": "Admin Address",
    "role": "ADMIN",
    "isActive": true,
    "accountType": "LOCAL",
    "createdAt": new Date(),
    "updatedAt": new Date()
})

## 3. Test Login ADMIN
POST http://localhost:3000/auth/login
Content-Type: application/json

{
    "email": "admin@flowershop.com",
    "password": "admin123"
}
