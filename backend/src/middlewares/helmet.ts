import helmet from 'helmet';
import { Express } from 'express';

export const setupHelmet = (app: Express): void => {
  // Using Helmet to set HTTP security headers
  app.use(helmet());
};