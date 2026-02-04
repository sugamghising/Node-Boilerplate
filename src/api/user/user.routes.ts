import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { createApiCreatedResponse, createApiResponse } from '../../config/openapi';
import { validateRequest } from '../../core/index';
import { userController } from './user.controller';
import {
  CreateUserSchema,
  DeleteResponseDataSchema,
  DeleteUserSchema,
  GetUserSchema,
  ListUsersSchema,
  UpdateUserSchema,
  UserListResponseDataSchema,
  UserSchema,
} from './user.validation';

const router = Router();
export const userRegistry = new OpenAPIRegistry();

// API Version prefix
const V1 = '/api/v1/';

// Register User Schema
userRegistry.register('User', UserSchema);

// List Users Route
userRegistry.registerPath({
  method: 'get',
  path: `${V1}users`,
  tags: ['Users'],
  summary: 'Get all users',
  description: 'Retrieve a paginated list of all users',
  request: {
    query: ListUsersSchema.shape.query,
  },
  responses: createApiResponse(UserListResponseDataSchema, 'List of users retrieved successfully'),
});
router.get('/', validateRequest(ListUsersSchema), userController.list);

// Get User by ID Route
userRegistry.registerPath({
  method: 'get',
  path: `${V1}users/{id}`,
  tags: ['Users'],
  summary: 'Get user by ID',
  description: 'Retrieve a single user by their ID',
  request: {
    params: GetUserSchema.shape.params,
  },
  responses: createApiResponse(UserSchema, 'User retrieved successfully'),
});
router.get('/:id', validateRequest(GetUserSchema), userController.getById);

// Create User Route
userRegistry.registerPath({
  method: 'post',
  path: `${V1}users`,
  tags: ['Users'],
  summary: 'Create a new user',
  description: 'Create a new user with email and name',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema.shape.body,
        },
      },
    },
  },
  responses: createApiCreatedResponse(UserSchema, 'User created successfully'),
});
router.post('/', validateRequest(CreateUserSchema), userController.create);

// Update User Route
userRegistry.registerPath({
  method: 'patch',
  path: `${V1}users/{id}`,
  tags: ['Users'],
  summary: 'Update a user',
  description: "Update an existing user's email or name",
  request: {
    params: UpdateUserSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateUserSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, 'User updated successfully'),
});
router.patch('/:id', validateRequest(UpdateUserSchema), userController.update);

// Delete User Route
userRegistry.registerPath({
  method: 'delete',
  path: `${V1}users/{id}`,
  tags: ['Users'],
  summary: 'Delete a user',
  description: 'Delete an existing user by ID',
  request: {
    params: DeleteUserSchema.shape.params,
  },
  responses: createApiResponse(DeleteResponseDataSchema, 'User deleted successfully'),
});
router.delete('/:id', validateRequest(DeleteUserSchema), userController.delete);

export { router as userRoutes };
