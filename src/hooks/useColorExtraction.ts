import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import { useImageCache } from './useImageCache';

interface ExtractedColors {
  primary: string;
  secondary: string;
  accent: string;
  palette: string[];
}

export const useColorExtraction = (imageUrl: string | undefined) => {
  const [colors, setColors] = useState<ExtractedColors | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getCachedColors, setCachedColors } = useImageCache();

  // Helper function for color enhancement
  const enhanceColor = (rgb: number[]) => {
    const [r, g, b] = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const saturation = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;
    
    if (saturation < 0.3 && luminance > 100) {
      return [Math.min(255, r + 20), Math.min(255, g + 30), Math.min(255, b + 60)];
    } else if (saturation < 0.3 && luminance <= 100) {
      return [Math.min(255, r + 40), Math.min(255, g + 20), Math.min(255, b + 50)];
    }
    
    const boostedR = Math.min(255, Math.round(r * 1.2));
    const boostedG = Math.min(255, Math.round(g * 1.2));
    const boostedB = Math.min(255, Math.round(b * 1.2));
    
    return [boostedR, boostedG, boostedB];
  };

  // Convert RGB arrays to hex strings
  const rgbToHex = (rgb: number[]) => {
    return `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
  };

  // Function to set fallback colors
  const setFallbackColors = () => {
    const fallbackColors = {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#a855f7',
      palette: ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe']
    };
    console.log('🎨 Using fallback colors:', fallbackColors);
    setColors(fallbackColors);
    if (imageUrl) {
      setCachedColors(imageUrl, fallbackColors);
    }
  };

  // Function to try proxy-based color extraction with multiple fallbacks
  const tryProxyColorExtraction = async (): Promise<void> => {
    if (!imageUrl) return;
    
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`,
      `https://cors-anywhere.herokuapp.com/${imageUrl}`,
      `https://thingproxy.freeboard.io/fetch/${imageUrl}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(imageUrl)}`
    ];
    
    for (let i = 0; i < proxies.length; i++) {
      const proxyUrl = proxies[i];
      console.log(`🎨 Trying CORS proxy ${i + 1}/${proxies.length}:`, proxyUrl);
      
      try {
        const success = await new Promise<boolean>((resolve) => {
          const proxyImg = new Image();
          proxyImg.crossOrigin = 'anonymous';
          
          const timeout = setTimeout(() => {
            console.log(`🎨 Proxy ${i + 1} timed out`);
            resolve(false);
          }, 10000); // 10 second timeout
          
          proxyImg.onload = () => {
            clearTimeout(timeout);
            try {
              const colorThief = new ColorThief();
              const dominantColor = colorThief.getColor(proxyImg);
              const palette = colorThief.getPalette(proxyImg, 5);
              
              const enhancedDominant = enhanceColor(dominantColor);
              const enhancedPalette = palette.map(enhanceColor);

              const primary = rgbToHex(enhancedDominant);
              const paletteHex = enhancedPalette.map(rgbToHex);
              
              const secondary = paletteHex[1] || primary;
              const accent = paletteHex[2] || secondary;

              const extractedColors = {
                primary,
                secondary,
                accent,
                palette: paletteHex
              };
              
              console.log(`🎨 Colors extracted successfully via proxy ${i + 1}:`, extractedColors);
              setColors(extractedColors);
              setCachedColors(imageUrl, extractedColors);
              resolve(true);
            } catch (error) {
              console.error(`🎨 Failed to extract colors via proxy ${i + 1}:`, error);
              resolve(false);
            }
          };
          
          proxyImg.onerror = () => {
            clearTimeout(timeout);
            console.log(`🎨 Proxy ${i + 1} failed`);
            resolve(false);
          };
          
          proxyImg.src = proxyUrl;
        });
        
        if (success) {
          return; // Success, exit early
        }
      } catch (error) {
        console.error(`🎨 Error with proxy ${i + 1}:`, error);
      }
    }
    
    // All proxies failed
    console.log('🎨 All CORS proxies failed, using fallback colors for:', imageUrl);
    setFallbackColors();
  };

  useEffect(() => {
    if (!imageUrl) {
      setColors(null);
      return;
    }

    const extractColors = async () => {
      setIsLoading(true);
      console.log('🎨 Starting color extraction for:', imageUrl);
      
      // Check cache first
      const cachedColors = getCachedColors(imageUrl);
      if (cachedColors) {
        setColors(cachedColors);
        setIsLoading(false);
        return;
      }
      
      // Check if this is a known domain that doesn't support CORS
      const knownCorsBlockedDomains = [
        'doerfelverse.com',
        'sirtjthewrathful.com',
        'thisisjdog.com'
      ];
      
      const shouldUseProxy = knownCorsBlockedDomains.some(domain => imageUrl.includes(domain));
      
      if (shouldUseProxy) {
        console.log('🎨 Using proxy for known CORS-blocked domain:', imageUrl);
        await tryProxyColorExtraction();
        setIsLoading(false);
        return;
      }
      
      try {
        const colorThief = new ColorThief();
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const dominantColor = colorThief.getColor(img);
            const palette = colorThief.getPalette(img, 5);
            
            const enhancedDominant = enhanceColor(dominantColor);
            const enhancedPalette = palette.map(enhanceColor);

            const primary = rgbToHex(enhancedDominant);
            const paletteHex = enhancedPalette.map(rgbToHex);
            
            const secondary = paletteHex[1] || primary;
            const accent = paletteHex[2] || secondary;

            const extractedColors = {
              primary,
              secondary,
              accent,
              palette: paletteHex
            };
            
            console.log('🎨 Colors extracted successfully:', extractedColors);
            setColors(extractedColors);
            setCachedColors(imageUrl, extractedColors);
          } catch (error) {
            console.error('Error extracting colors:', error);
            setColors(null);
          }
        };

        img.onerror = async () => {
          console.log('🎨 Direct image load failed, trying CORS proxy for:', imageUrl);
          await tryProxyColorExtraction();
          setIsLoading(false);
        };

        // Try direct load first
        img.src = imageUrl;
      } catch (error) {
        console.error('Color extraction error:', error);
        setColors(null);
      } finally {
        setIsLoading(false);
      }
    };

    extractColors();
  }, [imageUrl, getCachedColors, setCachedColors]);

  return { colors, isLoading };
};