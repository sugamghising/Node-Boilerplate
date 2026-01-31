import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index';
import { routes } from './routes';
import {
    errorHandler,
    notFoundHandler,
    requestLogger,
    rateLimiter,
} from './core/index';

export const createApp = (): Application => {
    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors({
        origin: config.cors.origin,
        credentials: true,
    }));

    // Rate limiting
    app.use(rateLimiter);

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    app.use(requestLogger);

    // Routes
    app.use(routes);

    // Error handling (must be last)
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
