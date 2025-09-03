import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'], // Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Backend running on http://localhost:3000');
  console.log('📧 Email Analysis API ready for Lucid Growth Assignment');
}
bootstrap();
