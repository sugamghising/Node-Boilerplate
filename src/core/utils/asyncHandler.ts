import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | undefined>;

/**
 * Wraps async route handlers to catch errors and pass them to Express error middleware.
 * This allows controllers to use async/await without try-catch blocks.
 *
 * @example
 * // In controller
 * public getUser = asyncHandler(async (req, res) => {
 *   const serviceResponse = await userService.findById(req.params.id);
 *   return handleServiceResponse(serviceResponse, res);
 * });
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
