import { Express } from 'express';
import rateLimit from 'express-rate-limit';

export const setupRateLimiter = (app: Express): void => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      message: 'Too many requests, please try again later.',
    },
  });

  // Apply rate limiting to all requests
  app.use(limiter);
};
