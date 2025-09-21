'use client';

import { useState, useEffect } from 'react';
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

  // Cleanup effect for object URLs (only for blob URLs)
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageSelected = (file: File) => {
    // Clean up previous object URL
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setSelectedImage(file);
    
    // Convert to base64 for better persistence across page navigation
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
    
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
        const stickerData = {
          images: response.images,
          style: selectedStyle,
          originalImage: imagePreview,
        };
        
        console.log('Storing sticker data:', {
          ...stickerData,
          originalImage: stickerData.originalImage ? 'URL present' : 'No URL'
        });
        
        sessionStorage.setItem('generatedStickers', JSON.stringify(stickerData));
        
        router.push('/preview');
      } else {
        throw new Error('Generation failed or incomplete');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate stickers. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to create sticker packs.</p>
          <Link href="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors group">
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Create Magic
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Transform your photos into stunning AI-powered sticker avatars with our advanced generation engine
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1: Upload */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-white">Upload Photo</h2>
                </div>
                
                <div className="mb-6">
                  <ImageUploader onImageSelected={handleImageSelected} />
                </div>
                
                {imagePreview && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Preview Ready
                    </h3>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                      <div className="relative bg-white/5 backdrop-blur rounded-xl p-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-contain rounded-lg"
                          onLoad={() => console.log('Image loaded successfully')}
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                            setGenerationError('Failed to load image preview');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Choose Style */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl h-full">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-white">Choose Style</h2>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {STICKER_STYLES.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => handleStyleSelected(style.id)}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                        selectedStyle === style.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/25'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{style.name}</h3>
                          <p className="text-gray-300 text-sm">{style.description}</p>
                        </div>
                        {selectedStyle === style.id && (
                          <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Generate */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    3
                  </div>
                  <h2 className="text-2xl font-bold text-white">Generate</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">What you'll get:</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        4 unique AI-generated stickers
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        High-resolution PNG format
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Transparent backgrounds
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Instant download
                      </li>
                    </ul>
                  </div>

                  {generationError && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-300 text-sm">{generationError}</p>
                      </div>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Creating magic...</span>
                        <span className="text-cyan-400 font-bold">{generationProgress}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                            style={{ width: `${generationProgress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={!selectedImage || isGenerating}
                    className="w-full relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className={`relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 ${
                      !selectedImage || isGenerating 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5'
                    }`}>
                      {isGenerating ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Magic...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate Stickers
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        `
      }} />
    </div>
  );
}
