import { Router } from 'express';
import priceRoutes from './priceRoutes';

const router = Router();

router.use('/price', priceRoutes);

export default router;
