import { Router } from 'express';

import demoController from '../controllers/demo.controllers';

const router = Router();

router.get('/demo', demoController.demo);

export default router;
