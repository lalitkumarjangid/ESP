"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    await app.listen(process.env.PORT ?? 3000);
    console.log('🚀 Backend running on http://localhost:3000');
    console.log('📧 Email Analysis API ready for Lucid Growth Assignment');
}
bootstrap();
//# sourceMappingURL=main.js.map