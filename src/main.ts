import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT')) || 3000;

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',     // React/Next.js local
      'http://localhost:5173',     // Vite local
      'https://your-frontend-domain.vercel.app', // Production frontend
      // Add more frontend URLs as needed
    ],
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

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Flower Shop API')
    .setDescription('API documentation for Flower Shop Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // For Vercel serverless
  if (process.env.VERCEL) {
    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return app.getHttpAdapter().getInstance();
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Export for Vercel
module.exports = bootstrap;

// For local development
if (require.main === module) {
  void bootstrap();
}
