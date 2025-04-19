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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/roman-numerals-db';
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
.then(() => {
  logger.info('Connected to MongoDB');
})
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    // Exit the process with failure code since MongoDB connection is critical
    process.exit(1);
  });

  // Handle graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  });
// Routes
app.use('/', conversionRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
    process.exit(1);
  });

export default app;