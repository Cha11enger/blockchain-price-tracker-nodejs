// src/swaggerConfig.ts

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blockchain Price Tracker API',
            version: '1.0.0',
            description: 'API documentation for Blockchain Price Tracker project',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API routes and controllers
};

export const swaggerSpec = swaggerJsdoc(options);
