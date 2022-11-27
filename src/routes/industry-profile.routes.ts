import { Router } from 'express';

import { requestFinancialDataForIndustryProfile } from '../controllers/industry-profile.controllers';

const router = Router();

router.get('/request-financial-data', requestFinancialDataForIndustryProfile);

export default router;
