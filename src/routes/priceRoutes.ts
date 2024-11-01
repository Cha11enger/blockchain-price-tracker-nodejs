// src/routes/priceRoutes.ts

import { Router, Request, Response } from 'express';
import { getLatestPrices, getHourlyPricesHandler, setPriceAlertHandler } from '../controllers/priceController';

const router = Router();

/**
 * @swagger
 * /price/latest:
 *   get:
 *     summary: Get the latest prices of Ethereum and Polygon
 *     tags: [Prices]
 *     responses:
 *       200:
 *         description: Successfully fetched latest prices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ethereum:
 *                   type: number
 *                   description: Latest price of Ethereum
 *                 polygon:
 *                   type: number
 *                   description: Latest price of Polygon
 *       500:
 *         description: Failed to fetch latest prices
 */
router.get('/latest', (req: Request, res: Response) => getLatestPrices(req, res));

/**
 * @swagger
 * /price/hourly/{chain}:
 *   get:
 *     summary: Get hourly prices for a specified chain within the last 24 hours
 *     tags: [Prices]
 *     parameters:
 *       - in: path
 *         name: chain
 *         schema:
 *           type: string
 *         required: true
 *         description: The chain to retrieve hourly prices for (e.g., ethereum, polygon)
 *     responses:
 *       200:
 *         description: Successfully fetched hourly prices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   price:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No hourly price data found for the specified chain in the last 24 hours
 *       500:
 *         description: Failed to fetch hourly prices
 */
router.get('/hourly/:chain', getHourlyPricesHandler);

/**
 * @swagger
 * /price/alert:
 *   post:
 *     summary: Set a price alert for a specific chain and target price
 *     tags: [Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chain:
 *                 type: string
 *                 description: The chain to set the alert for (e.g., ethereum, polygon)
 *               targetPrice:
 *                 type: number
 *                 description: The target price to trigger the alert
 *               email:
 *                 type: string
 *                 description: The email address to send the alert to
 *     responses:
 *       200:
 *         description: Alert set successfully
 *       500:
 *         description: Failed to set alert
 */
router.post('/alert', setPriceAlertHandler);

export default router;
