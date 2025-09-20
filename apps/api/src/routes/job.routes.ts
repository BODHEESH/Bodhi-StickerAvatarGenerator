import { Router } from 'express';
import { jobController } from '../controllers/job.controller';

const router = Router();

// Get job status and results
router.get('/:id', jobController.getJobStatus);

export default router;
