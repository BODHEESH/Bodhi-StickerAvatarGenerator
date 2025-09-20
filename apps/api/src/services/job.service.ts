import { StyleType } from './bodhiSnap.service';

// Define Job interface
interface Job {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt?: string;
  results?: StickerResult[];
  error?: string;
}

// Define StickerResult interface
interface StickerResult {
  url: string;
  thumbUrl: string;
  meta: {
    style: StyleType;
    index: number;
    [key: string]: any;
  };
}

// Mock database of jobs
const jobsDb: Record<string, Job> = {};

export const jobService = {
  getJobById: async (jobId: string): Promise<Job> => {
    // In a real implementation, this would query a database
    
    // If the job is not in our mock DB, create a mock entry
    if (!jobsDb[jobId]) {
      // For demo purposes, we'll create a mock job with random status
      const statuses: Array<'pending' | 'processing' | 'completed' | 'failed'> = ['pending', 'processing', 'completed', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      jobsDb[jobId] = {
        id: jobId,
        status: randomStatus,
        createdAt: new Date().toISOString(),
      };
      
      // If status is completed, add mock results
      if (randomStatus === 'completed') {
        jobsDb[jobId].results = Array(5).fill(null).map((_, i) => ({
          url: `https://storage.example.com/results/${jobId}/sticker-${i + 1}.webp`,
          thumbUrl: `https://storage.example.com/results/${jobId}/thumb-${i + 1}.webp`,
          meta: { style: 'retro', index: i + 1 }
        }));
      }
      
      // If status is failed, add error message
      if (randomStatus === 'failed') {
        jobsDb[jobId].error = 'Failed to generate stickers';
      }
    }
    
    return jobsDb[jobId];
  },
  
  updateJob: async (jobId: string, data: Partial<Job>): Promise<void> => {
    // In a real implementation, this would update a database record
    jobsDb[jobId] = { ...jobsDb[jobId], ...data };
  }
};
