import { Router } from 'express';
import { userController } from './user.controller';
import { validate, asyncHandler } from '../../core/index';
import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
    listUsersQuerySchema,
} from './user.validation';

const router = Router();

/**
 * @route   GET /users
 * @desc    Get all users with pagination
 * @access  Public
 */
router.get(
    '/',
    validate({ query: listUsersQuerySchema }),
    asyncHandler(userController.list)
);

/**
 * @route   GET /users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get(
    '/:id',
    validate({ params: userIdParamSchema }),
    asyncHandler(userController.getById)
);

/**
 * @route   POST /users
 * @desc    Create a new user
 * @access  Public
 */
router.post(
    '/',
    validate({ body: createUserSchema }),
    asyncHandler(userController.create)
);

/**
 * @route   PATCH /users/:id
 * @desc    Update a user
 * @access  Public
 */
router.patch(
    '/:id',
    validate({ params: userIdParamSchema, body: updateUserSchema }),
    asyncHandler(userController.update)
);

/**
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Public
 */
router.delete(
    '/:id',
    validate({ params: userIdParamSchema }),
    asyncHandler(userController.delete)
);

export { router as userRoutes };
