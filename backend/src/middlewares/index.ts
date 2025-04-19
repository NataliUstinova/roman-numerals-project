import { Express } from 'express';
import express from 'express';
import { setupCors } from './cors';
import { errorHandler } from './errorHandler';
import { requestLogger } from './requestLogger';

export const setupMiddlewares = (app: Express): void => {
  // Basic middlewares
  app.use(express.json());
  setupCors(app);
  
  // Logging middleware
  app.use(requestLogger);
  
  // Error handler should be the last middleware
  app.use(errorHandler);
};

export { default as logger } from './logger';