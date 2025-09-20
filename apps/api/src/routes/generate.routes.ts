import { Router } from 'express';
import { generateController } from '../controllers/generate.controller';

const router = Router();

// Generate stickers route
router.post('/', generateController.createGenerationJob);

export default router;
