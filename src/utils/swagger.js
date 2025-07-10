import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real-Time Messaging API',
      version: '1.0.0',
      description: 'API documentation for Real-Time Messaging application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            },
            success: {
              type: 'boolean',
              example: true,
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              example: 'Success',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data payload'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            },
            success: {
              type: 'boolean',
              example: false,
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              example: 'Error',
              description: 'Error message'
            },
            errors: {
              type: 'object',
              description: 'Error details'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
