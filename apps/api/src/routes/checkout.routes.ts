import { Router } from 'express';
import { checkoutController } from '../controllers/checkout.controller';

const router = Router();

// Create checkout session
router.post('/', checkoutController.createCheckoutSession);

export default router;
