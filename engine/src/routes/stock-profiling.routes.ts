import { Router } from 'express';

import { profileStocks } from '../controllers/stock-profiling.controller';

const router = Router();

router.get('/profile-stocks', profileStocks);

export default router;
