import { AppDataSource } from '../config/data-source';
import { Price } from '../entities/Price';
import { Alert } from '../entities/Alert';
import { sendEmailNotification } from './emailService';

const priceRepo = AppDataSource.getRepository(Price);
const alertRepo = AppDataSource.getRepository(Alert);

export const monitorPriceChanges = async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Chains to monitor
    const chains = ['ethereum', 'polygon'];

    for (const chain of chains) {
        // Fetch the latest price
        const latestPrice = await priceRepo.findOne({ where: { chain }, order: { createdAt: 'DESC' } });
        const oldPrice = await priceRepo.findOne({ where: { chain, createdAt: oneHourAgo }, order: { createdAt: 'DESC' } });

        if (latestPrice && oldPrice) {
            // Calculate the percentage increase in the last hour
            const priceIncrease = ((latestPrice.price - oldPrice.price) / oldPrice.price) * 100;

            // Send a notification if the price increase is greater than 3%
            if (priceIncrease > 3) {
                const subject = `Price Alert: ${chain.toUpperCase()} price increased by ${priceIncrease.toFixed(2)}%`;
                const text = `The price of ${chain.toUpperCase()} has increased by ${priceIncrease.toFixed(2)}% over the last hour.\nCurrent Price: $${latestPrice.price}\nPrevious Price: $${oldPrice.price}`;
                
                // Send notification email
                await sendEmailNotification(subject, text, 'hyperhire_assignment@hyperhire.in');
            }

            // Check for user-set alerts where the target price is reached or exceeded
            const triggeredAlerts = await alertRepo.find({
                where: { chain, targetPrice: latestPrice.price },
            });

            for (const alert of triggeredAlerts) {
                const alertSubject = `Price Alert: ${chain.toUpperCase()} reached your target price of $${alert.targetPrice}`;
                const alertText = `The price of ${chain.toUpperCase()} has reached your target price of $${alert.targetPrice}.\nCurrent Price: $${latestPrice.price}`;
                
                // Send alert email to the specified user
                await sendEmailNotification(alertSubject, alertText, alert.email);

                // Optionally, remove the alert if it's a one-time alert
                await alertRepo.remove(alert);
            }
        }
    }
};
