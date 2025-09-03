import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  const frontendUrl = process.env.FRONTEND_URL || 'https://your-frontend.onrender.com';
  const nodeEnv = process.env.NODE_ENV || 'development';

  app.enableCors({
    origin: nodeEnv === 'production'
      ? [frontendUrl, 'https://your-frontend.vercel.app'] // Allow both Render and Vercel in production
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`📧 Email Analysis API ready for Lucid Growth Assignment`);
  console.log(`🔗 Frontend URL: ${frontendUrl}`);
  console.log(`📊 IMAP monitoring: Active (polling every 60 seconds)`);
}
