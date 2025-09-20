import { Request, Response, NextFunction } from 'express';
import { webhookService } from '../services/webhook.service';

export const webhookController = {
  handleStripeWebhook: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      
      if (!signature) {
        return res.status(400).json({ error: 'Stripe signature is required' });
      }
      
      // Process Stripe webhook
      await webhookService.processStripeWebhook(req.body, signature);
      
      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  },
  
  handleAICallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId, results, error } = req.body;
      
      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }
      
      // Process AI callback
      await webhookService.processAICallback(jobId, results, error);
      
      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }
};
