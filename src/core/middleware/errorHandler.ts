import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { config } from '../../config/index';
import { AppError, type ErrorResponse } from '../errors/index';
import { logger } from '../logger/index';
import { HttpError } from '../utils/throwError';

interface RequestWithId extends Request {
  id?: string;
}

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorHandler = (
  err: Error,
  req: RequestWithId,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void => {
  // Log the error with context
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    name: err.name,
    method: req?.method || 'unknown',
    url: req?.originalUrl || 'unknown',
    requestId: req?.id || 'unknown',
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: StatusCodes.BAD_REQUEST,
        details: err.flatten(),
      },
    });
    return;
  }

  // Handle HttpError from throwError utility
  if (err instanceof HttpError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        statusCode: err.status,
      },
    };

    if (config.isDevelopment) {
      response.error.stack = err.stack;
    }

    res.status(err.status).json(response);
    return;
  }

  // Handle known operational errors (AppError)
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        details: err.details,
      },
    };

    // Include stack trace in development
    if (config.isDevelopment) {
      response.error.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle errors with status property (generic HTTP errors)
  const errorWithStatus = err as ErrorWithStatus;
  if (errorWithStatus.status && typeof errorWithStatus.status === 'number') {
    const status = errorWithStatus.status;
    res.status(status).json({
      success: false,
      error: {
        message: err.message,
        code: 'ERROR',
        statusCode: status,
      },
    });
    return;
  }

  // Handle unknown errors (don't leak details in production)
  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const response: ErrorResponse = {
    success: false,
    error: {
      message: config.isProduction ? 'An unexpected error occurred' : err.message,
      code: 'INTERNAL_ERROR',
      statusCode,
    },
  };

  if (config.isDevelopment) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
