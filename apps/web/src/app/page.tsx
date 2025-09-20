import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
          BodhiSnap Sticker Avatar Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your photos into delightful sticker avatars with AI magic. Perfect for WhatsApp, Telegram, and social media.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="card mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Create Your Sticker Pack</h2>
              <p className="text-gray-600 mb-6">
                Upload a selfie, choose a style, and get a pack of unique stickers in seconds.
                Express yourself in chats with personalized avatars!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/upload" className="btn-primary">
                  Create Stickers
                </Link>
                <Link href="/gallery" className="btn-outline">
                  View Examples
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-64 h-64">
                {/* Placeholder for sticker examples */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                  <p className="text-gray-400">Sticker Examples</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card">
            <h3 className="text-xl font-bold mb-2">1. Upload</h3>
            <p className="text-gray-600">
              Upload your selfie or take a photo with your webcam.
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold mb-2">2. Choose Style</h3>
            <p className="text-gray-600">
              Select from Retro, Miniature, or Cartoon styles.
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold mb-2">3. Share</h3>
            <p className="text-gray-600">
              Download and share your stickers on your favorite apps.
            </p>
          </div>
        </div>

        <div className="card bg-primary-50 border border-primary-100">
          <h2 className="text-2xl font-bold mb-4">Why Nano Banana Stickers?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Unique AI-powered style transformations</li>
            <li>Ready-to-use sticker packs for WhatsApp and Telegram</li>
            <li>Express yourself with personalized avatars</li>
            <li>Multiple styles to choose from</li>
            <li>Fast generation in seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
