"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_1 = require("../config/utils/logger");
const errorMiddleware = (err, req, res, next) => {
    logger_1.logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
};
exports.errorMiddleware = errorMiddleware;
