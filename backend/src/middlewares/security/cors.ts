import cors from 'cors';
import { Express } from 'express';

export const setupCors = (app: Express): void => {
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
          ? process.env.ALLOWED_ORIGINS?.split(',') // || 'https://domain.com' TODO add domain when prod is set
          : '*',
          methods: ['GET', 'POST', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization']
      };
  app.use(cors(corsOptions));
};