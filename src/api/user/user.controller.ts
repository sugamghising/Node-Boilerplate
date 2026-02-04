import type { Request, Response } from 'express';
import { asyncHandler, handleServiceResponse } from '../../core/index';
import { userService } from './user.service';

class UserController {
  /**
   * Get paginated list of users
   */
  public list = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const serviceResponse = await userService.findAll(page, limit);
    return handleServiceResponse(serviceResponse, res);
  });

  /**
   * Get user by ID
   */
  public getById = asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await userService.findById(req.params['id'] as string);
    return handleServiceResponse(serviceResponse, res);
  });

  /**
   * Create a new user
   */
  public create = asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await userService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  });

  /**
   * Update an existing user
   */
  public update = asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await userService.update(req.params['id'] as string, req.body);
    return handleServiceResponse(serviceResponse, res);
  });

  /**
   * Delete a user
   */
  public delete = asyncHandler(async (req: Request, res: Response) => {
    const serviceResponse = await userService.delete(req.params['id'] as string);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const userController = new UserController();
