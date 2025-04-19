import { Express } from 'express';
import express from 'express';
import { setupCors } from './cors';
import { setupHelmet } from './helmet';
import { setupRateLimiter } from './rateLimiter';
import { errorHandler } from './errorHandler';
import { requestLogger } from './requestLogger';

export const setupMiddlewares = (app: Express): void => {
  // Security middlewares
  setupHelmet(app);
  setupRateLimiter(app);
  
  // Basic middlewares
  app.use(express.json());
  setupCors(app);
  
  // Logging middleware
  app.use(requestLogger);
  
  // Error handler middleware
  app.use(errorHandler);
};

export { default as logger } from './logger';