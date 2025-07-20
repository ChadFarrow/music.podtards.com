import { useState, useEffect } from 'react';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export function useColorExtraction(imageUrl?: string) {
  const [colors, setColors] = useState<ColorPalette>({
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#6b7280'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;
    
    setIsLoading(true);
    
    // For now, return default colors
    // This could be enhanced with actual color extraction logic using ColorThief
    setTimeout(() => {
      setColors({
        primary: '#1f2937',
        secondary: '#374151',
        accent: '#6b7280'
      });
      setIsLoading(false);
    }, 100);
  }, [imageUrl]);

  return { colors, isLoading };
}