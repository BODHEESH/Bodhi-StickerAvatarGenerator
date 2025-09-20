import { Router } from 'express';
import uploadRoutes from './upload.routes';
import generateRoutes from './generate.routes';
import jobRoutes from './job.routes';
import checkoutRoutes from './checkout.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
router.use('/upload', uploadRoutes);
router.use('/generate', generateRoutes);
router.use('/job', jobRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/webhook', webhookRoutes);

export default router;
