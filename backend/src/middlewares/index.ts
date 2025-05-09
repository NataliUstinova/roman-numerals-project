import { Express } from 'express';
import express from 'express';

import { errorHandler } from './common/errorHandler';
import { requestLogger } from './logging/requestLogger';
import { setupCors } from './security/cors';
import { setupHelmet } from './security/helmet';
import { setupRateLimiter } from './security/rateLimiter';

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

export { default as logger } from './logging/logger';
