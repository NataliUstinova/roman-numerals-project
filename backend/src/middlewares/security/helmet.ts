import { Express } from 'express';
import helmet from 'helmet';

export const setupHelmet = (app: Express): void => {
  // Using Helmet to set HTTP security headers
  app.use(helmet());
};
