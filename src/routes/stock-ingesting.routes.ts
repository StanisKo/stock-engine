import { Router } from 'express';

import { ingestStocks } from '../controllers/stock-ingesting.controller';

const router = Router();

router.get('/ingest-stocks', ingestStocks);

export default router;
