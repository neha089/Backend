import { Request,Response,NextFunction } from "express";
import { logger } from "../../utils/logger";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
    
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
};
