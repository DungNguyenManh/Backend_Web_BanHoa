"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = Number(configService.get('PORT')) || 3000;
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://your-frontend-domain.vercel.app',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api/v1', { exclude: [''] });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Flower Shop API')
        .setDescription('API documentation for Flower Shop Backend')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    if (process.env.VERCEL) {
        await app.init();
        return app.getHttpAdapter().getInstance();
    }
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
module.exports = bootstrap;
if (require.main === module) {
    void bootstrap();
}
//# sourceMappingURL=main.js.map