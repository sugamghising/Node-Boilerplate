import { StatusCodes } from 'http-status-codes';

/**
 * Custom error with status code support
 */
export class HttpError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    code: string = 'ERROR'
  ) {
    super(message);
    this.status = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Utility function to throw an error with a specific message and status code.
 * This function never returns - it always throws.
 *
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param code - Error code (default: 'ERROR')
 * @throws {HttpError}
 *
 * @example
 * throwError("User not found", StatusCodes.NOT_FOUND);
 * throwError("Invalid credentials", StatusCodes.UNAUTHORIZED, "AUTH_ERROR");
 */
export const throwError = (
  message: string,
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  code: string = 'ERROR'
): never => {
  throw new HttpError(message, statusCode, code);
};

// Convenience functions for common error types
export const throwNotFound = (message: string = 'Resource not found'): never =>
  throwError(message, StatusCodes.NOT_FOUND, 'NOT_FOUND');

export const throwBadRequest = (message: string = 'Bad request'): never =>
  throwError(message, StatusCodes.BAD_REQUEST, 'BAD_REQUEST');

export const throwUnauthorized = (message: string = 'Unauthorized'): never =>
  throwError(message, StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');

export const throwForbidden = (message: string = 'Forbidden'): never =>
  throwError(message, StatusCodes.FORBIDDEN, 'FORBIDDEN');

export const throwConflict = (message: string = 'Conflict'): never =>
  throwError(message, StatusCodes.CONFLICT, 'CONFLICT');
