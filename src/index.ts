import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerConfig';
import { AppDataSource } from './config/data-source';
import router from './routes';
import { startPriceCron } from './services/priceCron';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialize database connection and start cron job
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');

        // Start the price fetching cron job
        startPriceCron();
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

// Use the main router for all routes
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
