'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/ui/ImageUploader';
import StyleSelector from '@/components/ui/StyleSelector';
import { STICKER_STYLES, generateStickersWithFallback, GenerationResponse } from '@/lib/nanoBananaApi';
import { useAuth } from '@/contexts/AuthContext';

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null as File | null);
  const [imagePreview, setImagePreview] = useState(null as string | null);
  const [selectedStyle, setSelectedStyle] = useState('cartoon' as string);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null as string | null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setGenerationError(null);
  };

  const handleStyleSelected = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setGenerationError('Please select an image first');
      return;
    }

    if (!user) {
      router.push('/auth');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(0);

    try {
      // Start generation progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response: GenerationResponse = await generateStickersWithFallback({
        image: selectedImage,
        style: selectedStyle,
        count: 4,
        size: 'medium',
        background: 'transparent',
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (response.status === 'completed' && response.images) {
        // Store the results in sessionStorage for the preview page
        sessionStorage.setItem('generatedStickers', JSON.stringify({
          images: response.images,
          style: selectedStyle,
          originalImage: imagePreview,
        }));
        
        router.push('/preview');
      } else if (response.status === 'processing') {
        // Handle async processing - you might want to implement polling here
        router.push(`/preview?jobId=${response.id}`);
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate stickers. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-primary-600 mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Create Your Sticker Pack</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">1. Upload Your Photo</h2>
            <ImageUploader onImageSelected={handleImageSelected} />
            
            {imagePreview && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Preview:</h3>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">2. Choose a Style</h2>
              <StyleSelector 
                styles={STICKER_STYLES} 
                selectedStyle={selectedStyle} 
                onStyleSelected={handleStyleSelected} 
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">3. Generate Stickers</h2>
              <p className="text-gray-600 mb-4">
                We'll create 4 unique stickers based on your photo and chosen style.
                You can download them individually or as a pack.
              </p>
              
              {isGenerating && generationProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Generating stickers...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <button 
                className="btn-primary w-full"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage}
              >
                {isGenerating ? 'Generating Stickers...' : 'Generate Stickers'}
              </button>
              
              {generationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{generationError}</p>
                </div>
              )}

              {!user && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-600 text-sm">
                    Please <Link href="/auth" className="underline font-medium">sign in</Link> to generate stickers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
