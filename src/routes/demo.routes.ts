import { Router } from 'express';

import demoController from '../controllers/industry-profile.controllers';

const router = Router();

router.get('/demo', demoController.demo);

export default router;
