// Nano Banana AI API Integration

export interface StickerStyle {
  id: string;
  name: string;
  description: string;
  preview?: string;
}

export interface GenerationRequest {
  image: File | string; // File object or base64 string
  style: string;
  count?: number; // Number of stickers to generate (default: 4)
  size?: 'small' | 'medium' | 'large'; // Output size
  background?: 'transparent' | 'white' | 'auto';
}

export interface GenerationResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  images?: string[]; // Array of generated image URLs
  error?: string;
  progress?: number; // 0-100
  estimatedTime?: number; // seconds
}

export interface JobStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  images?: string[];
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_NANO_BANANA_API_URL || 'https://api.nanobanana.ai/v1';
const API_KEY = process.env.NANO_BANANA_API_KEY;

// Available sticker styles
export const STICKER_STYLES: StickerStyle[] = [
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Fun and playful cartoon-style avatars',
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese anime-inspired character style',
  },
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic portrait style',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple design',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Artistic watercolor painting effect',
  },
  {
    id: 'pop-art',
    name: 'Pop Art',
    description: 'Bold and vibrant pop art style',
  },
  {
    id: 'sketch',
    name: 'Sketch',
    description: 'Hand-drawn sketch style',
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    description: '8-bit retro pixel art style',
  },
];

// Helper function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Generate stickers using Nano Banana AI
export const generateStickers = async (request: GenerationRequest): Promise<GenerationResponse> => {
  try {
    let imageData: string;
    
    // Convert File to base64 if needed
    if (request.image instanceof File) {
      imageData = await fileToBase64(request.image);
    } else {
      imageData = request.image;
    }

    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        image: imageData,
        style: request.style,
        count: request.count || 4,
        size: request.size || 'medium',
        background: request.background || 'transparent',
        model: process.env.NEXT_PUBLIC_NANO_BANANA_MODEL || 'sticker-avatar-v1',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating stickers:', error);
    throw error;
  }
};

// Check job status
export const checkJobStatus = async (jobId: string): Promise<JobStatus> => {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Status check failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking job status:', error);
    throw error;
  }
};

// Download generated images
export const downloadImage = async (imageUrl: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

// Download all images as a zip file
export const downloadAllImages = async (images: string[], packName: string): Promise<void> => {
  try {
    // For now, download images individually
    // In production, you might want to create a zip file on the server
    for (let i = 0; i < images.length; i++) {
      const filename = `${packName}_sticker_${i + 1}.png`;
      await downloadImage(images[i], filename);
      // Add a small delay between downloads to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Error downloading all images:', error);
    throw error;
  }
};

// Validate API configuration
export const validateApiConfig = (): boolean => {
  if (!API_KEY || API_KEY === 'your_nano_banana_api_key_here') {
    console.warn('Nano Banana API key not configured');
    return false;
  }
  return true;
};

// Mock function for development/testing
export const generateMockStickers = async (request: GenerationRequest): Promise<GenerationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate more realistic placeholder images based on style
  const baseUrl = 'https://picsum.photos/300/300';
  const styleSeeds = {
    cartoon: [100, 200, 300, 400],
    anime: [500, 600, 700, 800],
    realistic: [900, 1000, 1100, 1200],
    minimalist: [1300, 1400, 1500, 1600],
    watercolor: [1700, 1800, 1900, 2000],
    'pop-art': [2100, 2200, 2300, 2400],
  };
  
  const seeds = styleSeeds[request.style as keyof typeof styleSeeds] || [100, 200, 300, 400];
  
  return {
    id: `mock_job_${Date.now()}`,
    status: 'completed',
    images: seeds.map(seed => `${baseUrl}?random=${seed}`),
    progress: 100,
  };
};

// Main function that uses real API if configured, otherwise falls back to mock
export const generateStickersWithFallback = async (request: GenerationRequest): Promise<GenerationResponse> => {
  if (validateApiConfig()) {
    return generateStickers(request);
  } else {
    console.warn('Using mock API for development. Please configure NANO_BANANA_API_KEY for production.');
    return generateMockStickers(request);
  }
};
