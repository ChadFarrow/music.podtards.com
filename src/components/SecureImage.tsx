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

    // Convert HTTP to HTTPS for security
    let secureSrc = src;
    if (src.startsWith('http://')) {
      secureSrc = src.replace('http://', 'https://');
    }

    // Try multiple proxy fallbacks for better mobile compatibility
    const proxies = [
      secureSrc, // Try direct first
      `https://images.weserv.nl/?url=${encodeURIComponent(secureSrc)}&w=600&h=600&fit=cover&output=webp`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(secureSrc)}`,
      `https://cors-anywhere.herokuapp.com/${secureSrc}`
    ];

    let currentProxyIndex = 0;

    const tryLoadImage = () => {
      if (currentProxyIndex >= proxies.length) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        setImgSrc(proxies[currentProxyIndex]);
        setIsLoading(false);
        setHasError(false);
      };
      
      img.onerror = () => {
        currentProxyIndex++;
        if (currentProxyIndex < proxies.length) {
          setTimeout(tryLoadImage, 100); // Small delay before trying next proxy
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      };
      
      img.src = proxies[currentProxyIndex];
    };

    tryLoadImage();
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
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
      {imgSrc && (
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
          style={{ imageRendering: 'auto' }}
        />
      )}
    </>
  );
}