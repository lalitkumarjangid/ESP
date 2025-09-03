import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication using environment variables
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const nodeEnv = process.env.NODE_ENV || 'development';

  app.enableCors({
    origin:
      nodeEnv === 'production'
        ? [frontendUrl] // In production, only allow the specified frontend URL
        : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            frontendUrl,
          ], // In development, allow multiple localhost ports
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
}
bootstrap();
