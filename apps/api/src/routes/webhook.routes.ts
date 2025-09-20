import { Router } from 'express';
import express from 'express';
import { webhookController } from '../controllers/webhook.controller';

const router = Router();

// Stripe webhook
router.post('/stripe', express.raw({ type: 'application/json' }), webhookController.handleStripeWebhook);

// AI callback webhook (for Nano Banana)
router.post('/ai-callback', webhookController.handleAICallback);

export default router;
