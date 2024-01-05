import swaggerJsdoc from 'swagger-jsdoc';
import routeFiles from './RouteFiles.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VideoTube API',
      version: '1.0.0',
      description:
        'API documentation for Your My Production Ready VideoTube Application',
    },
  },
  apis: routeFiles, // Include all route files
};

const specs = swaggerJsdoc(options);
export default specs;
