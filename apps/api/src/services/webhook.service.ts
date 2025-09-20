import { jobService } from './job.service';
import { StyleType } from './bodhiSnap.service';

// Define interfaces for webhook payloads
interface StripeWebhookPayload {
  type: string;
  data: {
    object: {
      metadata: {
        userId: string;
        packId: string;
      };
    };
  };
}

interface AICallbackResult {
  url: string;
  thumbUrl: string;
  meta: {
    style: StyleType;
    prompt: string;
    index: number;
  };
}

export const webhookService = {
  processStripeWebhook: async (payload: StripeWebhookPayload, signature: string): Promise<void> => {
    // In a real implementation, this would verify the signature and process the event
    console.log('Processing Stripe webhook:', payload);
    
    // Mock implementation
    if (payload.type === 'checkout.session.completed') {
      const { userId, packId } = payload.data.object.metadata;
      
      // Update user entitlements
      console.log(`User ${userId} purchased pack ${packId}`);
    }
  },
  
  processAICallback: async (jobId: string, results: AICallbackResult[] | null, error: string | null): Promise<void> => {
    // In a real implementation, this would update the job status and results
    console.log(`Processing AI callback for job ${jobId}`);
    
    if (error) {
      await jobService.updateJob(jobId, {
        status: 'failed',
        error,
        updatedAt: new Date().toISOString(),
      });
    } else if (results) {
      await jobService.updateJob(jobId, {
        status: 'completed',
        results,
        updatedAt: new Date().toISOString(),
      });
    }
  }
};
