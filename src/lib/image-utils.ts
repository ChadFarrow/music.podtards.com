/**
 * Utility functions for handling image loading and CORS issues
 */

export interface ImageProxyOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}

/**
 * Get a CORS-friendly URL for an image
 */
export function getSecureImageUrl(
  originalUrl: string, 
  options: ImageProxyOptions = {}
): string {
  if (!originalUrl) return '';
  
  const {
    width = 800,
    height = 800,
    quality = 85,
    format = 'webp'
  } = options;

  // Check if the URL needs proxying
  const needsProxy = 
    originalUrl.includes('heycitizen.xyz') ||
    originalUrl.includes('behindthesch3m3s.com') ||
    originalUrl.includes('files.heycitizen.xyz') ||
    originalUrl.startsWith('http://') ||
    originalUrl.includes('corsproxy.io');

  if (!needsProxy) {
    return originalUrl;
  }

  // Use images.weserv.nl as the primary proxy service
  const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=${width}&h=${height}&fit=cover&output=${format}&q=${quality}`;
  
  return proxyUrl;
}

/**
 * Get fallback image URLs for different scenarios
 */
export function getFallbackImageUrl(originalUrl: string): string[] {
  const fallbacks = [
    // Try with different proxy services
    `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=800&h=800&fit=cover&output=webp`,
    `https://cors-anywhere.herokuapp.com/${originalUrl}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`,
    // Add more fallback services as needed
  ];
  
  return fallbacks;
}

/**
 * Check if an image URL is accessible
 */
export async function checkImageAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // This will always succeed, but we can't check the actual status
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get a music-themed fallback emoji based on the original URL
 */
export function getMusicFallbackEmoji(url: string): string {
  const fallbacks = ['🎵', '🎶', '🎸', '🎹', '🥁', '🎺', '🎻', '🎤'];
  const hash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return fallbacks[Math.abs(hash) % fallbacks.length];
} 