import { Router } from 'express';

import { createStockProfile } from '../controllers/stock-profile.controllers';

const router = Router();

router.get('/create-stock-profile', createStockProfile);

export default router;
