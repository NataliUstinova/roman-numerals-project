import { Request, Response, NextFunction } from 'express';
import logger from './logger';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.status || err.statusCode || 500;
  
  logger.error(`Error: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    statusCode,
    stack: err.stack
  });

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};