// Sticker related types
interface Sticker {
  id: number;
  url: string;
  thumbUrl: string;
  meta?: Record<string, any>;
}

// Style related types
interface Style {
  id: string;
  name: string;
  description: string;
}

// Job related types
type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface Job {
  id: string;
  status: JobStatus;
  results?: Sticker[];
  error?: string;
  createdAt: string;
  updatedAt?: string;
}

// API response types
interface UploadResponse {
  imageUrl: string;
}

interface GenerateResponse {
  jobId: string;
}

interface JobResponse extends Job {}

interface CheckoutResponse {
  sessionUrl: string;
}
