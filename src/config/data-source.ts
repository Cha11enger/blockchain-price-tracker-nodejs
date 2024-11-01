import { DataSource } from 'typeorm';
import { Price } from '../entities/Price';
import { Alert } from '../entities/Alert';

// console.log('Database Configuration:', {
//     host: process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT,
//     username: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DB,
// });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [Price, Alert],  // Ensure entities are correctly referenced here
    migrations: [],
    subscribers: [],
});
