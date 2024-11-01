import axios from 'axios';
import { Between } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Price } from '../entities/Price';
import { getMoralisPriceUrl } from '../utils/getMoralisPriceUrl';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;


export const getHourlyPrices = async (chain: string): Promise<Price[]> => {
    const priceRepo = AppDataSource.getRepository(Price);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    return await priceRepo.find({
        where: {
            chain,
            createdAt: Between(twentyFourHoursAgo, new Date()),
        },
        order: { createdAt: 'ASC' },
    });
};

// Fetch price from Moralis API
export const fetchPrice = async (chain: string): Promise<number | null> => {
    const url = getMoralisPriceUrl(chain);
    if (!url) {
        console.error(`Invalid chain: ${chain}`);
        return null;
    }

    try {
        const response = await axios.get(url, {
            headers: { 'X-API-Key': MORALIS_API_KEY },
        });
        return response.data.usdPrice;
    } catch (error) {
        console.error(`Error fetching price for ${chain}:`, error);
        return null;
    }
};

// Save price to the database
export const savePrice = async (chain: string, price: number) => {
    const priceRepo = AppDataSource.getRepository(Price);
    const priceEntry = priceRepo.create({ chain, price });
    await priceRepo.save(priceEntry);
    console.log(`Saved ${chain} price: $${price}`);
};

// Fetch and save price (combination of fetch and save functions)
export const fetchAndSavePrice = async (chain: string) => {
    const price = await fetchPrice(chain);
    if (price !== null) {
        await savePrice(chain, price);
    }
};
