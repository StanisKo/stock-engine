import { Router } from 'express';

import { scoreStocks } from '../controllers/stock-scoring.controller';

const router = Router();

router.get('/score-stocks', scoreStocks);

export default router;
