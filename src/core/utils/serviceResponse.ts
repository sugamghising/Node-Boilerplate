import { StatusCodes } from 'http-status-codes';

export enum ResponseStatus {
  Success = 'success',
  Failed = 'failed',
}

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly statusCode: number;

  private constructor(status: ResponseStatus, message: string, data: T, statusCode: number) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  /**
   * Creates a successful service response
   * @param message - Success message
   * @param data - Response data
   * @param statusCode - HTTP status code (default: 200)
   */
  static success<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK
  ): ServiceResponse<T> {
    return new ServiceResponse(ResponseStatus.Success, message, data, statusCode);
  }

  /**
   * Creates a failed service response
   * @param message - Error message
   * @param data - Error data (optional)
   * @param statusCode - HTTP status code (default: 500)
   */
  static failure<T = null>(
    message: string,
    data: T = null as T,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ): ServiceResponse<T> {
    return new ServiceResponse(ResponseStatus.Failed, message, data, statusCode);
  }

  /**
   * Creates a created response (201)
   */
  static created<T>(message: string, data: T): ServiceResponse<T> {
    return new ServiceResponse(ResponseStatus.Success, message, data, StatusCodes.CREATED);
  }

  /**
   * Creates a not found response (404)
   */
  static notFound(message: string = 'Resource not found'): ServiceResponse<null> {
    return new ServiceResponse(ResponseStatus.Failed, message, null, StatusCodes.NOT_FOUND);
  }

  /**
   * Creates a bad request response (400)
   */
  static badRequest<T = null>(
    message: string = 'Bad request',
    data: T = null as T
  ): ServiceResponse<T> {
    return new ServiceResponse(ResponseStatus.Failed, message, data, StatusCodes.BAD_REQUEST);
  }

  /**
   * Creates an unauthorized response (401)
   */
  static unauthorized(message: string = 'Unauthorized'): ServiceResponse<null> {
    return new ServiceResponse(ResponseStatus.Failed, message, null, StatusCodes.UNAUTHORIZED);
  }

  /**
   * Creates a forbidden response (403)
   */
  static forbidden(message: string = 'Forbidden'): ServiceResponse<null> {
    return new ServiceResponse(ResponseStatus.Failed, message, null, StatusCodes.FORBIDDEN);
  }

  /**
   * Creates a conflict response (409)
   */
  static conflict(message: string = 'Conflict'): ServiceResponse<null> {
    return new ServiceResponse(ResponseStatus.Failed, message, null, StatusCodes.CONFLICT);
  }
}
