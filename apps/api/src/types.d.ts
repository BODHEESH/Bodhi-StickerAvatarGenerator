// API type definitions

// User related types
interface User {
  id: string;
  name?: string;
  email: string;
  stripeCustomerId?: string;
  plan?: string;
  createdAt: Date;
}

// Image job related types
interface ImageJob {
  jobId: string;
  userId: string;
  inputImageUrl: string;
  prompts: string[];
  status: 'pending' | 'processing' | 'done' | 'failed';
  results?: ImageResult[];
  error?: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface ImageResult {
  url: string;
  thumbUrl: string;
  meta: {
    style: string;
    index: number;
    [key: string]: any;
  };
}

// Sticker pack related types
interface StickerPack {
  id: string;
  userId: string;
  jobId: string;
  packName: string;
  files: string[];
  price?: number;
  createdAt: Date;
}

// API request/response types
interface UploadRequest {
  userId?: string;
}

interface UploadResponse {
  imageUrl: string;
}

interface GenerateRequest {
  userId: string;
  imageUrl: string;
  style: string;
  options?: {
    count?: number;
    [key: string]: any;
  };
}

interface GenerateResponse {
  jobId: string;
}

interface JobResponse {
  status: 'pending' | 'processing' | 'done' | 'failed';
  results?: ImageResult[];
  error?: string;
}

interface CheckoutRequest {
  userId: string;
  packId: string;
}

interface CheckoutResponse {
  sessionUrl: string;
}

// Declare modules for libraries that don't have TypeScript definitions
declare module 'bull' {
  export default class Queue {
    constructor(name: string, options?: any);
    add(data: any, options?: any): Promise<any>;
    process(handler: (job: any) => Promise<any>): void;
  }
}
