'use client';

import { useCallback, useState } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onImageSelected(file);
    }
  }, [onImageSelected]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    console.error('File rejected:', fileRejections);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group
        ${isDragActive 
          ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/25' 
          : 'border-white/20 hover:border-cyan-400/50 hover:bg-white/5'
        }`}
    >
      <input 
        {...getInputProps()} 
        accept="image/jpeg,image/jpg,image/png,image/webp"
        capture="environment"
      />
      
      {/* Animated background effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-cyan-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Click to upload
            </span> or drag and drop
          </p>
          <p className="text-sm text-gray-300">
            PNG, JPG or WEBP (MAX. 10MB)
          </p>
        </div>
        
        {/* Upload icon animation */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-5 h-5 text-cyan-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
      </div>
    </div>
  );
}
