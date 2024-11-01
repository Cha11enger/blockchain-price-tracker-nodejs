import { Request, Response, RequestHandler } from 'express';
import { AppDataSource } from '../config/data-source';
import { Price } from '../entities/Price';
import { Alert } from '../entities/Alert';
import { fetchAndSavePrice, getHourlyPrices } from '../services/priceService';


export const getHourlyPricesHandler: RequestHandler = async (req, res) => {
    const chain = req.params.chain;

    try {
        const prices = await getHourlyPrices(chain);

        if (prices.length === 0) {
            res.status(404).json({ message: 'No hourly price data found for the specified chain in the last 24 hours.' });
            return; // Add return to end the function here
        }

        res.json(prices);
    } catch (error) {
        console.error('Error fetching hourly prices:', error);
        res.status(500).json({ error: 'Failed to fetch hourly prices' });
    }
};

// Fetch and save price data
export const fetchAndSavePriceData = async (chain: string) => {
    await fetchAndSavePrice(chain);
};

// Controller function to get the latest prices
export const getLatestPrices = async (req: Request, res: Response) => {
    try {
        const priceRepo = AppDataSource.getRepository(Price);
        const ethereumPrice = await priceRepo.findOne({
            where: { chain: 'ethereum' },
            order: { createdAt: 'DESC' },
        });
        const polygonPrice = await priceRepo.findOne({
            where: { chain: 'polygon' },
            order: { createdAt: 'DESC' },
        });
        res.json({
            ethereum: ethereumPrice?.price,
            polygon: polygonPrice?.price,
        });
    } catch (error) {
        console.error('Error fetching latest prices:', error);
        res.status(500).json({ error: 'Failed to fetch latest prices' });
    }
};

export const setPriceAlertHandler: RequestHandler = async (req, res) => {
    const { chain, targetPrice, email } = req.body;

    try {
        const alertRepo = AppDataSource.getRepository(Alert);
        const newAlert = alertRepo.create({ chain, targetPrice, email });
        await alertRepo.save(newAlert);

        res.status(201).json({ message: 'Price alert set successfully', alert: newAlert });
    } catch (error) {
        console.error('Error setting price alert:', error);
        res.status(500).json({ error: 'Failed to set price alert' });
    }
};
