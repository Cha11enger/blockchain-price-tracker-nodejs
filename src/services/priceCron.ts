import cron from 'node-cron';
import { fetchAndSavePrice } from './priceService';
import { monitorPriceChanges } from './priceMonitor';

// Initialize and start the cron job
export const startPriceCron = () => {
    console.log('Starting cron job to fetch prices every 5 minutes...');

    // Run initially on startup to get immediate data
    fetchAndSavePrice('ethereum');
    fetchAndSavePrice('polygon');

    // Schedule the cron job for every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        console.log('Cron job: Fetching and saving prices...');
        await fetchAndSavePrice('ethereum');
        await fetchAndSavePrice('polygon');
    });

    cron.schedule('0 * * * *', async () => {
        console.log('Cron job: Checking for price increase...');
        await monitorPriceChanges();
    });
};
