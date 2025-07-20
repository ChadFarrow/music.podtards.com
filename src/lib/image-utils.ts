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
    originalUrl.includes('corsproxy.io') ||
    originalUrl.includes('doerfelverse.com') ||
    originalUrl.includes('cloudfront.net');

  if (!needsProxy) {
    return originalUrl;
  }

  // Use a more reliable proxy service
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`;
  
  return proxyUrl;
}

/**
 * Get fallback image URLs for different scenarios
 */
export function getFallbackImageUrl(originalUrl: string): string[] {
  const fallbacks = [
    // Try with different proxy services
    `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`,
    `https://thingproxy.freeboard.io/fetch/${originalUrl}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(originalUrl)}`,
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

/**
 * Create a data URL for a simple fallback image
 */
export function createFallbackDataUrl(emoji: string, size: number = 200): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#374151');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add the emoji
    ctx.font = `${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(emoji, size / 2, size / 2);
  }
  
  return canvas.toDataURL();
} 