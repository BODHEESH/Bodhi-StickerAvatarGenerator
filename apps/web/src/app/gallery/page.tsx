'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for gallery - replace with actual data from your backend
const mockGalleryItems = [
  {
    id: '1',
    title: 'Cartoon Style Avatar',
    style: 'cartoon',
    createdAt: '2024-01-15',
    images: [
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
    ],
    userId: 'user1',
    isPublic: true,
  },
  {
    id: '2',
    title: 'Anime Style Pack',
    style: 'anime',
    createdAt: '2024-01-14',
    images: [
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
    ],
    userId: 'user2',
    isPublic: true,
  },
  {
    id: '3',
    title: 'Realistic Portrait',
    style: 'realistic',
    createdAt: '2024-01-13',
    images: [
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
    ],
    userId: 'user1',
    isPublic: true,
  },
  {
    id: '4',
    title: 'Minimalist Style',
    style: 'minimalist',
    createdAt: '2024-01-12',
    images: [
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
    ],
    userId: 'user3',
    isPublic: true,
  },
  {
    id: '5',
    title: 'Watercolor Effect',
    style: 'watercolor',
    createdAt: '2024-01-11',
    images: [
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
    ],
    userId: 'user2',
    isPublic: true,
  },
  {
    id: '6',
    title: 'Pop Art Style',
    style: 'pop-art',
    createdAt: '2024-01-10',
    images: [
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
      '/api/placeholder/150/150',
    ],
    userId: 'user1',
    isPublic: true,
  },
];

const styleFilters = [
  { value: 'all', label: 'All Styles' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'anime', label: 'Anime' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'pop-art', label: 'Pop Art' },
];

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null as any);
  const [galleryItems, setGalleryItems] = useState(mockGalleryItems);
  const [viewMode, setViewMode] = useState('public' as 'public' | 'my');
  const { user } = useAuth();

  const filteredItems = galleryItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.style === selectedFilter;
    const matchesViewMode = viewMode === 'public' ? item.isPublic : (user && item.userId === user.uid);
    return matchesFilter && matchesViewMode;
  });

  const handleDownload = (item: any) => {
    // Implement download functionality
    console.log('Downloading item:', item.id);
    alert('Download functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
              <p className="text-gray-600">
                Explore amazing sticker avatars created by our community
              </p>
            </div>
            
            {user && (
              <div className="mt-4 md:mt-0">
                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setViewMode('public')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'public'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Public Gallery
                  </button>
                  <button
                    onClick={() => setViewMode('my')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'my'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    My Creations
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {styleFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="grid grid-cols-2 gap-1 p-2">
                  {item.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square relative bg-gray-200 rounded">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Sticker {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="capitalize">{item.style} style</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              {viewMode === 'my' 
                ? "You haven't created any sticker packs yet." 
                : "No public gallery items match your current filter."}
            </p>
            {viewMode === 'my' && (
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Pack
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for viewing full item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                  <p className="text-gray-600 capitalize">{selectedItem.style} style</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedItem.images.map((image, index) => (
                  <div key={index} className="aspect-square relative bg-gray-200 rounded-lg">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Sticker {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Pack
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
