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

    // Try the original URL first
    setImgSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
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
    
    // Set a timeout to mark as loaded
    setTimeout(() => {
      setIsLoading(false);
      setHasError(false);
    }, 100);
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