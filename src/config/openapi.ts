import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { config } from './index';

// Create the main OpenAPI registry
export const registry = new OpenAPIRegistry();

// Common response schemas
export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
    statusCode: z.number(),
  });

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  data: z.null(),
  statusCode: z.number(),
});

export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

/**
 * Creates a standardized API response schema for OpenAPI documentation
 * @param dataSchema - The Zod schema for the response data
 * @param description - Description for the successful response
 */
export const createApiResponse = <T extends z.ZodTypeAny>(
  dataSchema: T,
  description: string = 'Successful response'
) => {
  return {
    200: {
      description,
      content: {
        'application/json': {
          schema: ServiceResponseSchema(dataSchema),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  };
};

/**
 * Creates a standardized API response for created resources (201)
 */
export const createApiCreatedResponse = <T extends z.ZodTypeAny>(
  dataSchema: T,
  description: string = 'Resource created successfully'
) => {
  return {
    201: {
      description,
      content: {
        'application/json': {
          schema: ServiceResponseSchema(dataSchema),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: 'Conflict - Resource already exists',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  };
};

/**
 * Generates the OpenAPI document from the registry
 */
export const generateOpenAPIDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express TypeScript API',
      version: '1.0.0',
      description: 'A production-ready REST API built with Node.js, Express, and TypeScript',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server',
      },
    ],
    externalDocs: {
      description: 'API Documentation',
      url: '/api-docs',
    },
  });
};
