"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
exports.databaseConfig = mongoose_1.MongooseModule.forRootAsync({
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => ({
        uri: configService.get('MONGODB_URI'),
    }),
    inject: [config_1.ConfigService],
});
//# sourceMappingURL=database.config.js.map