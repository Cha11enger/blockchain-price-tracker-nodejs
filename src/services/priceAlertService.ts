// src/services/priceAlertService.ts

import { AppDataSource } from '../config/data-source';
import { Alert } from '../entities/Alert';

export const setPriceAlert = async (chain: string, targetPrice: number, email: string) => {
    const alertRepo = AppDataSource.getRepository(Alert);
    const newAlert = alertRepo.create({ chain, targetPrice, email });
    await alertRepo.save(newAlert);
    console.log(`Alert set for ${chain} at $${targetPrice} to notify ${email}`);
};
