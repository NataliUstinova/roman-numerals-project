import { setupCors } from '../cors';
import cors from 'cors';
import express from 'express';

// Mock the cors middleware
jest.mock('cors', () => {
  return jest.fn(() => jest.fn());
});

describe('setupCors function', () => {
  let app: express.Express;

  beforeEach(() => {
    // Reset environment before each test
    delete process.env.NODE_ENV;
    delete process.env.ALLOWED_ORIGINS;

    // Create a fresh Express app for each test
    app = express();

    // Clear all mocks
    jest.clearAllMocks();
  });

  test('should use wildcard origin in development environment', () => {
    // Set NODE_ENV to development
    process.env.NODE_ENV = 'development';

    // Call the function
    setupCors(app);

    // Verify cors was called with wildcard origin
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: '*',
      }),
    );
  });

  test('should use comma-separated origins in production environment', () => {
    // Set environment to production with allowed origins
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORIGINS =
      'https://app.example.com,https://admin.example.com';

    // Call the function
    setupCors(app);

    // Verify cors was called with array of origins
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: ['https://app.example.com', 'https://admin.example.com'],
      }),
    );
  });

  test('should handle empty ALLOWED_ORIGINS in production', () => {
    // Set environment to production with no allowed origins
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORIGINS = '';

    // Call the function
    setupCors(app);

    // Verify cors was called with empty array
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: [''],
      }),
    );
  });

  test('should handle undefined ALLOWED_ORIGINS in production', () => {
    // Set environment to production with no ALLOWED_ORIGINS defined
    process.env.NODE_ENV = 'production';

    // Call the function
    setupCors(app);

    // Verify cors was called with undefined origin
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: undefined,
      }),
    );
  });

  test('should preserve other cors options regardless of environment', () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORIGINS = 'https://example.com';

    // Call the function
    setupCors(app);

    // Verify other options remain the same
    expect(cors).toHaveBeenCalledWith(
      expect.objectContaining({
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );
  });
});
