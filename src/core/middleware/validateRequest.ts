import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { BadRequestError } from '../errors/index';

interface RequestSchema {
  shape: {
    body?: ZodTypeAny;
    query?: ZodTypeAny;
    params?: ZodTypeAny;
  };
}

/**
 * Middleware factory to validate request data against Zod schemas.
 * Compatible with OpenAPI registry pattern using Zod-to-OpenAPI.
 *
 * @param schema - Zod schema object containing body, query, and/or params schemas
 * @returns Express middleware function
 *
 * @example
 * // Define schema with Zod
 * const PostLoginSchema = z.object({
 *   body: z.object({
 *     email: z.string().email(),
 *     password: z.string().min(8),
 *   }),
 * });
 *
 * // Use in route
 * router.post('/login', validateRequest(PostLoginSchema), controller.login);
 */
export const validateRequest = (schema: RequestSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const { body, query, params } = schema.shape;

      if (params) {
        const result = params.safeParse(req.params);
        if (!result.success) {
          throw new BadRequestError('Validation failed for params', result.error.flatten());
        }
        req.params = result.data as typeof req.params;
      }

      if (query) {
        const result = query.safeParse(req.query);
        if (!result.success) {
          throw new BadRequestError('Validation failed for query', result.error.flatten());
        }
        req.query = result.data as typeof req.query;
      }

      if (body) {
        const result = body.safeParse(req.body);
        if (!result.success) {
          throw new BadRequestError('Validation failed for body', result.error.flatten());
        }
        req.body = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
