import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// User Schema for OpenAPI documentation
export const UserSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    email: z.string().email().openapi({ example: 'user@example.com' }),
    name: z.string().openapi({ example: 'John Doe' }),
    createdAt: z.date().openapi({ example: '2024-01-01T00:00:00.000Z' }),
    updatedAt: z.date().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  })
  .openapi('User');

// Request Schemas
export const CreateUserSchema = z
  .object({
    body: z.object({
      email: z.string().email('Invalid email format').openapi({ example: 'user@example.com' }),
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .openapi({ example: 'John Doe' }),
    }),
  })
  .openapi('CreateUserRequest');

export const UpdateUserSchema = z
  .object({
    params: z.object({
      id: z.string().uuid('Invalid user ID format'),
    }),
    body: z
      .object({
        email: z
          .string()
          .email('Invalid email format')
          .optional()
          .openapi({ example: 'user@example.com' }),
        name: z
          .string()
          .min(2, 'Name must be at least 2 characters')
          .max(100, 'Name must be less than 100 characters')
          .optional()
          .openapi({ example: 'John Doe' }),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
      }),
  })
  .openapi('UpdateUserRequest');

export const GetUserSchema = z
  .object({
    params: z.object({
      id: z.string().uuid('Invalid user ID format'),
    }),
  })
  .openapi('GetUserRequest');

export const DeleteUserSchema = z
  .object({
    params: z.object({
      id: z.string().uuid('Invalid user ID format'),
    }),
  })
  .openapi('DeleteUserRequest');

export const ListUsersSchema = z
  .object({
    query: z.object({
      page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
      limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
    }),
  })
  .openapi('ListUsersRequest');

// Response Schemas for OpenAPI
export const UserListResponseDataSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const DeleteResponseDataSchema = z.object({
  message: z.string(),
});

// Legacy exports for backwards compatibility
export const createUserSchema = CreateUserSchema.shape.body;
export const updateUserSchema = UpdateUserSchema.shape.body;
export const userIdParamSchema = GetUserSchema.shape.params;
export const listUsersQuerySchema = ListUsersSchema.shape.query;

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
