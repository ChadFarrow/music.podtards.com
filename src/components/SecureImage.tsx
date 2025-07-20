import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getSecureImageUrl, getFallbackImageUrl, getMusicFallbackEmoji } from '@/lib/image-utils';

interface SecureImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
}

export function SecureImage({ 
  src, 
  alt, 
  className, 
  fallback,
  width = 800,
  height = 800
}: SecureImageProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setFallbackIndex(0);

    // Get the secure image URL
    const secureSrc = getSecureImageUrl(src, { width, height });
    setImgSrc(secureSrc);
  }, [src, width, height]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    // Get fallback URLs
    const fallbackUrls = getFallbackImageUrl(src);
    
    // Try the next fallback URL
    if (fallbackIndex < fallbackUrls.length) {
      setFallbackIndex(prev => prev + 1);
      setImgSrc(fallbackUrls[fallbackIndex]);
      return;
    }
    
    // All fallbacks failed
    setIsLoading(false);
    setHasError(true);
  };

  // Get a music-themed fallback emoji if none provided
  const fallbackEmoji = fallback || getMusicFallbackEmoji(src);

  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-800 text-gray-400 text-4xl', className)}>
        {fallbackEmoji}
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