import { useState, useEffect } from 'react';

export function useAlbumColors(imageUrl?: string) {
  const [colors, setColors] = useState({
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#6b7280'
  });

  useEffect(() => {
    // For now, return default colors
    // This could be enhanced with actual color extraction logic
    setColors({
      primary: '#1f2937',
      secondary: '#374151', 
      accent: '#6b7280'
    });
  }, [imageUrl]);

  return colors;
}