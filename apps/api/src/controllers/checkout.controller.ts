import { Request, Response, NextFunction } from 'express';
import { checkoutService } from '../services/checkout.service';

export const checkoutController = {
  createCheckoutSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, packId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      if (!packId) {
        return res.status(400).json({ error: 'Pack ID is required' });
      }
      
      // Create Stripe checkout session
      const session = await checkoutService.createCheckoutSession(userId, packId);
      
      res.status(200).json({ sessionUrl: session.url });
    } catch (error) {
      next(error);
    }
  }
};
