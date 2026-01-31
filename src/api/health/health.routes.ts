import { Router } from 'express';
import { healthController } from './health.controller';

const router = Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', healthController.getHealth);

export { router as healthRoutes };
