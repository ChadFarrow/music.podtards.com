import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface CachedColors {
  primary: string;
  secondary: string;
  accent: string;
  palette: string[];
  timestamp: number;
}

interface CachedImage {
  url: string;
  timestamp: number;
}

interface ImageCache {
  colors: Record<string, CachedColors>;
  corsImages: Record<string, CachedImage>;
}

const CACHE_DURATION = {
  COLORS: 7 * 24 * 60 * 60 * 1000, // 7 days
  IMAGES: 24 * 60 * 60 * 1000, // 24 hours
};

export function useImageCache() {
  const [cache, setCache] = useLocalStorage<ImageCache>('image-cache', {
    colors: {},
    corsImages: {}
  });

  // Clean up expired cache entries
  useEffect(() => {
    const now = Date.now();
    let hasChanges = false;
    const newCache = { ...cache };

    // Clean expired colors
    Object.keys(newCache.colors).forEach(key => {
      if (now - newCache.colors[key].timestamp > CACHE_DURATION.COLORS) {
        delete newCache.colors[key];
        hasChanges = true;
      }
    });

    // Clean expired images
    Object.keys(newCache.corsImages).forEach(key => {
      if (now - newCache.corsImages[key].timestamp > CACHE_DURATION.IMAGES) {
        delete newCache.corsImages[key];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setCache(newCache);
    }
  }, [cache, setCache]);

  const getCachedColors = (imageUrl: string): CachedColors | null => {
    const cached = cache.colors[imageUrl];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.COLORS) {
      console.log('🎨 Using cached colors for:', imageUrl);
      return cached;
    }
    return null;
  };

  const setCachedColors = (imageUrl: string, colors: Omit<CachedColors, 'timestamp'>) => {
    const newCache = { ...cache };
    newCache.colors[imageUrl] = {
      ...colors,
      timestamp: Date.now()
    };
    setCache(newCache);
    console.log('🎨 Cached colors for:', imageUrl);
  };

  const getCachedCorsUrl = (originalUrl: string): string | null => {
    const cached = cache.corsImages[originalUrl];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.IMAGES) {
      console.log('🖼️ Using cached CORS URL for:', originalUrl);
      return cached.url;
    }
    return null;
  };

  const setCachedCorsUrl = (originalUrl: string, corsUrl: string) => {
    const newCache = { ...cache };
    newCache.corsImages[originalUrl] = {
      url: corsUrl,
      timestamp: Date.now()
    };
    setCache(newCache);
    console.log('🖼️ Cached CORS URL for:', originalUrl);
  };

  const clearCache = () => {
    setCache({ colors: {}, corsImages: {} });
    console.log('🗑️ Image cache cleared');
  };

  const getCacheStats = () => {
    const now = Date.now();
    const activeColors = Object.keys(cache.colors).filter(key => 
      now - cache.colors[key].timestamp < CACHE_DURATION.COLORS
    ).length;
    const activeImages = Object.keys(cache.corsImages).filter(key => 
      now - cache.corsImages[key].timestamp < CACHE_DURATION.IMAGES
    ).length;
    
    return {
      totalColors: Object.keys(cache.colors).length,
      activeColors,
      totalImages: Object.keys(cache.corsImages).length,
      activeImages,
      cacheSize: JSON.stringify(cache).length
    };
  };

  return {
    getCachedColors,
    setCachedColors,
    getCachedCorsUrl,
    setCachedCorsUrl,
    clearCache,
    getCacheStats
  };
} 