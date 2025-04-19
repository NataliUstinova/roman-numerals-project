import { Request, Response } from 'express';
import { errorHandler } from '../errorHandler';
import logger from '../../logging/logger';

// Mock the logger
jest.mock('../../logging/logger', () => ({
  error: jest.fn()
}));

describe('errorHandler middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      originalUrl: '/test-url',
      method: 'GET'
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
    
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  it('should log error with correct details', () => {
    const error = new Error('Test error');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(logger.error).toHaveBeenCalledWith('Error: Test error', {
      url: '/test-url',
      method: 'GET',
      statusCode: 500,
      stack: error.stack
    });
  });

  it('should respond with status 500 for generic errors', () => {
    const error = new Error('Test error');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test error'
    });
  });

  it('should use custom status code if provided', () => {
    const error = new Error('Not found') as any;
    error.status = 404;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Not found'
    });
  });

  it('should use statusCode if status is not provided', () => {
    const error = new Error('Bad request') as any;
    error.statusCode = 400;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Bad request'
    });
  });

  it('should include stack trace in development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const error = new Error('Test error');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test error',
      stack: error.stack
    });
    
    // Restore environment
    process.env.NODE_ENV = originalEnv;
  });

  it('should use "Internal Server Error" when error message is undefined', () => {
    // Create an error with undefined message
    const error = new Error() as any;
    error.message = undefined;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal Server Error'
    });
  });
});