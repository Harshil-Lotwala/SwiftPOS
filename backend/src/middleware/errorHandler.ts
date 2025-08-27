import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../types';

export const errorHandler = (
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  // Handle known API errors
  if (error instanceof Error && 'statusCode' in error) {
    const apiError = error as ApiError;
    statusCode = apiError.statusCode;
    message = apiError.message;
    code = apiError.code || 'API_ERROR';
  }

  // Handle MySQL errors
  if (error.message.includes('ER_DUP_ENTRY')) {
    statusCode = 400;
    message = 'Duplicate entry - record already exists';
    code = 'DUPLICATE_ENTRY';
  }

  if (error.message.includes('ER_NO_REFERENCED_ROW')) {
    statusCode = 400;
    message = 'Referenced record does not exist';
    code = 'INVALID_REFERENCE';
  }

  // Handle JWT errors
  if (error.message.includes('JsonWebTokenError')) {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }

  if (error.message.includes('TokenExpiredError')) {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // Handle Joi validation errors
  if (error.message.includes('ValidationError')) {
    statusCode = 400;
    message = error.message;
    code = 'VALIDATION_ERROR';
  }

  // Log the error
  logger.error('API Error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    statusCode,
    code,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// Create API error helper
export const createApiError = (
  message: string,
  statusCode: number = 500,
  code?: string
): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};
