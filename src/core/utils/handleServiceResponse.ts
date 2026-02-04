import type { Response } from 'express';
import type { ServiceResponse } from './serviceResponse';

/**
 * Handles the service response and sends the appropriate HTTP response
 * @param serviceResponse - The service response object
 * @param res - Express response object
 */
export const handleServiceResponse = <T>(
  serviceResponse: ServiceResponse<T>,
  res: Response
): Response => {
  return res.status(serviceResponse.statusCode).json({
    success: serviceResponse.success,
    message: serviceResponse.message,
    data: serviceResponse.data,
    statusCode: serviceResponse.statusCode,
  });
};
