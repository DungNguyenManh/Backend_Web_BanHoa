#!/usr/bin/env node

/**
 * Script kiểm tra chuẩn bị deploy
 * Chạy: node scripts/pre-deploy-check.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'vercel.json',
  'package.json',
  'tsconfig.json',
  'src/main.ts',
  'src/app.module.ts',
  '.env.example'
];

const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

console.log('🔍 Kiểm tra chuẩn bị deploy...\n');

// Kiểm tra file cần thiết
console.log('📁 Kiểm tra files cần thiết:');
let missingFiles = [];
REQUIRED_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Kiểm tra package.json scripts
console.log('\n📦 Kiểm tra package.json scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start:prod', 'vercel-build'];
requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} - MISSING`);
    missingFiles.push(`script: ${script}`);
  }
});

// Kiểm tra dependencies
console.log('\n📚 Kiểm tra dependencies cần thiết:');
const requiredDeps = [
  '@nestjs/core',
  '@nestjs/common',
  '@nestjs/mongoose',
  '@nestjs/config',
  '@nestjs/jwt',
  'mongoose',
  'cloudinary',
  'bcrypt',
  'class-validator',
  'class-transformer'
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    missingFiles.push(`dependency: ${dep}`);
  }
});

// Kiểm tra .env.example
console.log('\n🔑 Kiểm tra .env.example:');
const envExample = fs.readFileSync('.env.example', 'utf8');
REQUIRED_ENV_VARS.forEach(envVar => {
  if (envExample.includes(envVar)) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`❌ ${envVar} - MISSING`);
    missingFiles.push(`env var: ${envVar}`);
  }
});

// Kiểm tra vercel.json
console.log('\n⚙️ Kiểm tra vercel.json:');
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
if (vercelConfig.builds && vercelConfig.builds.length > 0) {
  console.log(`✅ Builds configuration`);
} else {
  console.log(`❌ Builds configuration - MISSING`);
  missingFiles.push('vercel builds config');
}

if (vercelConfig.routes && vercelConfig.routes.length > 0) {
  console.log(`✅ Routes configuration`);
} else {
  console.log(`❌ Routes configuration - MISSING`);
  missingFiles.push('vercel routes config');
}

// Kết quả
console.log('\n' + '='.repeat(50));
if (missingFiles.length === 0) {
  console.log('🎉 TẤT CẢ KIỂM TRA ĐỀU PASS!');
  console.log('✅ Sẵn sàng deploy lên Vercel!');
  console.log('\nNext steps:');
  console.log('1. Tạo MongoDB Atlas database');
  console.log('2. Cấu hình Cloudinary account');
  console.log('3. Push code lên GitHub');
  console.log('4. Connect GitHub repo với Vercel');
  console.log('5. Cấu hình environment variables trên Vercel');
  console.log('6. Deploy!');
} else {
  console.log('❌ CÓ VẤN ĐỀ CẦN KHẮC PHỤC:');
  missingFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('\nVui lòng khắc phục các vấn đề trên trước khi deploy!');
}

console.log('\n📖 Đọc DEPLOYMENT-GUIDE.md để biết hướng dẫn chi tiết!');
