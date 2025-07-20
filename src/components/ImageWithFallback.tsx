import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallback = '🎵',
  width = 200,
  height = 200
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Check if the image URL is from an external domain that might have CORS issues
    const isExternalImage = src.startsWith('http') && !src.includes(window.location.hostname);
    
    if (isExternalImage) {
      // For external images, try to load them with error handling
      const img = new Image();
      
      // Set up error handling before setting src to avoid CORS errors in console
      img.onload = () => {
        setImgSrc(src);
        setIsLoading(false);
        setHasError(false);
      };
      
      img.onerror = () => {
        // Silently handle error and create fallback
        createFallbackImage();
      };
      
      // Set crossOrigin to anonymous to try to avoid CORS issues
      img.crossOrigin = 'anonymous';
      img.src = src;
      
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        if (isLoading) {
          createFallbackImage();
        }
      }, 3000);
      
      return () => clearTimeout(timeout);
    } else {
      // For same-origin images, load directly
      setImgSrc(src);
    }
  }, [src, isLoading]);

  const createFallbackImage = () => {
    // Create a fallback data URL with the emoji
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1f2937');
      gradient.addColorStop(1, '#374151');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add the emoji
      ctx.font = `${Math.min(width, height) * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(fallback, width / 2, height / 2);
    }
    
    const fallbackDataUrl = canvas.toDataURL();
    setImgSrc(fallbackDataUrl);
    setIsLoading(false);
    setHasError(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    // Only create fallback if we haven't already
    if (!imgSrc.includes('data:image')) {
      createFallbackImage();
    }
  };

  if (hasError && !imgSrc) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-800 text-gray-400 text-4xl', className)}>
        {fallback}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={cn('animate-pulse bg-gray-800', className)} />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        crossOrigin="anonymous"
      />
    </>
  );
} 