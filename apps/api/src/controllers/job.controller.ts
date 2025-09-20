import { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/job.service';

export const jobController = {
  getJobStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'Job ID is required' });
      }
      
      // Get job status and results
      const job = await jobService.getJobById(id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  }
};
