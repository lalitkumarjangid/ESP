"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const frontendUrl = process.env.FRONTEND_URL || 'https://your-frontend.onrender.com';
    const nodeEnv = process.env.NODE_ENV || 'development';
    app.enableCors({
        origin: nodeEnv === 'production'
            ? [frontendUrl, 'https://your-frontend.vercel.app']
            : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', frontendUrl],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.setGlobalPrefix('api');
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on http://localhost:${port}`);
    console.log(`🌍 Environment: ${nodeEnv}`);
    console.log(`📧 Email Analysis API ready for Lucid Growth Assignment`);
    console.log(`🔗 Frontend URL: ${frontendUrl}`);
    console.log(`📊 IMAP monitoring: Active (polling every 60 seconds)`);
}
//# sourceMappingURL=main.js.map