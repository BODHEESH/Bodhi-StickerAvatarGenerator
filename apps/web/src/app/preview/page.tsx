'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkJobStatus, downloadAllImages, downloadImage } from '@/lib/nanoBananaApi';
import { useAuth } from '@/contexts/AuthContext';

interface StickerData {
  images: string[];
  style: string;
  originalImage: string;
}

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = searchParams.get('jobId');
  
  const [status, setStatus] = useState<JobStatus>('pending');
  const [stickers, setStickers] = useState<string[]>([]);
  const [selectedStickers, setSelectedStickers] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [stickerData, setStickerData] = useState<StickerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStickerData = async () => {
      try {
        // First, try to get data from sessionStorage (for immediate results)
        const storedData = sessionStorage.getItem('generatedStickers');
        if (storedData) {
          const data: StickerData = JSON.parse(storedData);
          setStickerData(data);
          setStickers(data.images);
          setStatus('completed');
          // Auto-select all stickers
          setSelectedStickers(data.images.map((_, index) => index));
          return;
        }

        // If we have a jobId, poll for status
        if (jobId) {
          setStatus('processing');
          const pollInterval = setInterval(async () => {
            try {
              const jobStatus = await checkJobStatus(jobId);
              
              if (jobStatus.status === 'completed' && jobStatus.images) {
                setStickers(jobStatus.images);
                setStatus('completed');
                setSelectedStickers(jobStatus.images.map((_, index) => index));
                clearInterval(pollInterval);
              } else if (jobStatus.status === 'failed') {
                setStatus('failed');
                setError(jobStatus.error || 'Generation failed');
                clearInterval(pollInterval);
              }
              // Continue polling if still processing
            } catch (error) {
              console.error('Error checking job status:', error);
              setStatus('failed');
              setError('Failed to check generation status');
              clearInterval(pollInterval);
            }
          }, 2000);

          // Clean up interval on unmount
          return () => clearInterval(pollInterval);
        } else {
          // No data and no jobId - redirect back to upload
          router.push('/upload');
        }
      } catch (error) {
        console.error('Error loading sticker data:', error);
        setStatus('failed');
        setError('Failed to load sticker data');
      }
    };

    loadStickerData();
  }, [jobId, router]);

  const toggleSticker = (id: number) => {
    setSelectedStickers((prev: number[]) => 
      prev.includes(id) 
        ? prev.filter((sId: number) => sId !== id) 
        : [...prev, id]
    );
  };

  const handleDownload = async () => {
    if (selectedStickers.length === 0) return;
    
    setIsDownloading(true);
    
    try {
      const selectedImages = selectedStickers.map(index => stickers[index]);
      
      if (selectedImages.length === 1) {
        // Download single image
        await downloadImage(selectedImages[0], `sticker_${Date.now()}.png`);
      } else {
        // Download multiple images
        const packName = `sticker_pack_${stickerData?.style || 'custom'}_${Date.now()}`;
        await downloadAllImages(selectedImages, packName);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = (platform: string) => {
    // In a real implementation, you would integrate with the platform's sharing API
    const shareText = `Check out my custom stickers created with BodhiSnap! 🎨`;
    const shareUrl = window.location.href;
    
    if (platform === 'WhatsApp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      window.open(whatsappUrl, '_blank');
    } else if (platform === 'Telegram') {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramUrl, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/upload" className="inline-flex items-center text-primary-600 mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Upload
        </Link>

        <h1 className="text-3xl font-bold mb-8">Your Sticker Pack</h1>

        {status === 'pending' || status === 'processing' ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 border-solid mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">
              {status === 'pending' ? 'Preparing your stickers...' : 'Generating stickers...'}
            </h2>
            <p className="text-gray-600">
              This may take a minute. We're transforming your photo into awesome stickers!
            </p>
          </div>
        ) : status === 'failed' ? (
          <div className="card text-center py-12 bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2 text-red-700">Generation Failed</h2>
            <p className="text-red-600 mb-6">
              {error || 'We encountered an issue while creating your stickers. Please try again.'}
            </p>
            <Link href="/upload" className="btn-primary">
              Try Again
            </Link>
          </div>
        ) : (
          <>
            {/* Show original image if available */}
            {stickerData?.originalImage && (
              <div className="card mb-8">
                <h2 className="text-xl font-bold mb-4">Original Image</h2>
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={stickerData.originalImage} 
                      alt="Original" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">
                Your Generated Stickers
                {stickerData?.style && (
                  <span className="ml-2 text-sm font-normal text-gray-600 capitalize">
                    ({stickerData.style} style)
                  </span>
                )}
              </h2>
              <p className="text-gray-600 mb-6">
                Select the stickers you want to download or share. Click on any sticker to toggle selection.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {stickers.map((stickerUrl: string, index: number) => (
                  <div 
                    key={index}
                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedStickers.includes(index) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleSticker(index)}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {stickerUrl.includes('placeholder') ? (
                        <div className="text-gray-400">Sticker {index + 1}</div>
                      ) : (
                        <img 
                          src={stickerUrl} 
                          alt={`Sticker ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<div class="text-gray-400">Sticker ${index + 1}</div>`;
                          }}
                        />
                      )}
                    </div>
                    {selectedStickers.includes(index) && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {stickers.length > 0 && (
                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                  <span>{selectedStickers.length} of {stickers.length} stickers selected</span>
                  <button
                    onClick={() => setSelectedStickers(
                      selectedStickers.length === stickers.length 
                        ? [] 
                        : stickers.map((_, index) => index)
                    )}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedStickers.length === stickers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Download Options</h2>
                <button 
                  className="btn-primary w-full mb-4"
                  onClick={handleDownload}
                  disabled={isDownloading || selectedStickers.length === 0}
                >
                  {isDownloading ? 'Downloading...' : `Download ${selectedStickers.length} Stickers`}
                </button>
                <p className="text-sm text-gray-500">
                  Free users can download up to 5 stickers. Upgrade to download more and remove watermarks.
                </p>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold mb-4">Share Your Stickers</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    className="btn-outline flex items-center justify-center"
                    onClick={() => handleShare('WhatsApp')}
                  >
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    className="btn-outline flex items-center justify-center"
                    onClick={() => handleShare('Telegram')}
                  >
                    <span>Telegram</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Want more stickers and premium features?</p>
              <Link href="/pricing" className="btn-secondary">
                Upgrade to Premium
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
