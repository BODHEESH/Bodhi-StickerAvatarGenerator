import Queue from 'bull';
import axios from 'axios';
import { bodhiSnapService } from './bodhiSnap.service';
import type { StyleType } from './bodhiSnap.service';

// Define job interface
interface GenerationJob {
  jobId: string;
  userId: string;
  imageUrl: string;
  style: StyleType;
  options: Record<string, any>;
  createdAt: Date;
}

// Define result interface
interface GenerationResult {
  url: string;
  thumbUrl: string;
  meta: {
    style: string;
    prompt: string;
    index: number;
  };
}

// Create a Bull queue
const generationQueue = new Queue('sticker-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Process jobs
generationQueue.process(async (job: any) => {
  const { jobId, imageUrl, style, options } = job.data;
  
  try {
    console.log(`Processing job ${jobId} for image ${imageUrl} with style ${style}`);
    
    // Update job status to processing
    await updateJobStatus(jobId, 'processing');
    
    // Download the image
    let imageBuffer: Buffer;
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error(`Error downloading image from ${imageUrl}:`, error);
      throw new Error('Failed to download image');
    }
    
    // Generate stickers using our mock BodhiSnap service
    const count = options.count || 5;
    const results = await bodhiSnapService.generateStickers(
      imageBuffer,
      style as StyleType,
      count
    );
    
    // Update job status in database
    await updateJobStatus(jobId, 'completed', results);
    
    return results;
  } catch (error: any) {
    console.error(`Error processing job ${jobId}:`, error);
    
    // Update job status in database
    await updateJobStatus(jobId, 'failed', null, error.message);
    
    throw error;
  }
});

// Mock database function
async function updateJobStatus(
  jobId: string, 
  status: 'pending' | 'processing' | 'completed' | 'failed',
  results: GenerationResult[] | null = null,
  error: string | null = null
) {
  console.log(`Updating job ${jobId} status to ${status}`);
  // In a real implementation, this would update a database record
}

export const generateService = {
  queueGenerationJob: async (job: GenerationJob): Promise<void> => {
    // Create a record in the database
    await updateJobStatus(job.jobId, 'pending');
    
    // Add job to queue
    await generationQueue.add(job, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }
};
