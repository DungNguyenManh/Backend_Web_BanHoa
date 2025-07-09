const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');

let app;

async function createApp() {
  if (!app) {
    try {
      console.log('Creating NestJS app...');
      const { AppModule } = require('../dist/app.module');
      
      app = await NestFactory.create(AppModule);
      
      console.log('App created successfully');
      
      // Enable CORS
      app.enableCors({
        origin: true,
        credentials: true,
      });

      // Global validation pipe
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));

      app.setGlobalPrefix('api/v1');
      
      await app.init();
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error creating app:', error);
      throw error;
    }
  }
  
  return app;
}

module.exports = async (req, res) => {
  try {
    console.log('Serverless function called:', req.url);
    const nestApp = await createApp();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    });
  }
};
