import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SecureImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export function SecureImage({ src, alt, className, fallback = '🎵' }: SecureImageProps) {
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

    // Use CORS-friendly image proxy for all external images
    let secureSrc = src;
    
    // Check if it's a problematic domain that needs proxying
    const needsProxy = src.includes('heycitizen.xyz') || 
                      src.includes('behindthesch3m3s.com') ||
                      src.startsWith('http://');
    
    if (needsProxy) {
      // Use a different proxy service that handles CORS better
      secureSrc = `https://corsproxy.io/?${encodeURIComponent(src)}`;
    }

    setImgSrc(secureSrc);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    // If the image failed and we haven't tried proxy yet, try with proxy
    if (imgSrc === src && !imgSrc.includes('corsproxy.io')) {
      const proxySrc = `https://corsproxy.io/?${encodeURIComponent(src)}`;
      setImgSrc(proxySrc);
      return;
    }
    
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
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
      />
    </>
  );
}