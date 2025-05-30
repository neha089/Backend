"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const logger_1 = require("./utils/logger");
const authMiddleware_1 = require("./middleware/authMiddleware");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
}));
app.use('/auth', authRoutes_1.default);
app.use('/properties', authMiddleware_1.authMiddleware, propertyRoutes_1.default);
app.use('/favorites', authMiddleware_1.authMiddleware, favoriteRoutes_1.default);
app.use('/recommendations', authMiddleware_1.authMiddleware, recommendationRoutes_1.default);
app.use(errorMiddleware_1.errorMiddleware);
const PORT = process.env.PORT || 3000;
(0, database_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        logger_1.logger.info(`Server running on port ${PORT}`);
    });
});
