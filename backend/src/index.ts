import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import conversionRoutes from './routes/conversionRoutes';
import { setupMiddlewares } from './middlewares';
import { logger } from './middlewares';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Setup middlewares
setupMiddlewares(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
  });

// Routes
app.use('/', conversionRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;