import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateService } from '../services/generate.service';

export const generateController = {
  createGenerationJob: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, imageUrl, style, options } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
      }
      
      if (!style) {
        return res.status(400).json({ error: 'Style is required' });
      }
      
      // Create a unique job ID
      const jobId = uuidv4();
      
      // Add job to queue
      await generateService.queueGenerationJob({
        jobId,
        userId: userId || 'anonymous',
        imageUrl,
        style,
        options: options || {},
        createdAt: new Date()
      });
      
      res.status(202).json({ jobId });
    } catch (error) {
      next(error);
    }
  }
};
