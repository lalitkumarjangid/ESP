const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

    // Enable CORS for frontend communication
    const frontendUrl = process.env.FRONTEND_URL || 'https://your-frontend-domain.vercel.app';
    app.enableCors({
      origin: [frontendUrl, 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Set global API prefix
    app.setGlobalPrefix('api');

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await bootstrap();
    const expressApp = nestApp.getHttpAdapter().getInstance();

    // Handle the request
    expressApp(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
