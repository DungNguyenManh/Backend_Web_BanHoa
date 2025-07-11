import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT')) || 8080;

  // Enable CORS for frontend
  app.enableCors({
    origin: true,  // Allow tất cả origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Bật validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Loại bỏ thuộc tính không có trong DTO
    forbidNonWhitelisted: true, // Throw error nếu có thuộc tính không hợp lệ
    transform: true,           // Tự động chuyển đổi type
  }));

  app.setGlobalPrefix('api/v1', { exclude: [''] });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
