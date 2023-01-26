import { Router } from 'express';

import { profileStock } from '../controllers/sigle-stock-profiling.controller';

const router = Router();

router.get('/profile-single-stock', profileStock);

export default router;
