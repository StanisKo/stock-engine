import { Router } from 'express';

import { createIndustryProfileFromTicker } from '../controllers/industry-profile.controllers';

const router = Router();

router.get('/create-industry-profile', createIndustryProfileFromTicker);

export default router;
