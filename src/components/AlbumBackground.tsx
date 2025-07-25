import { ReactNode, useMemo } from 'react';
import { useColorExtraction } from '@/hooks/useColorExtraction';
import { useImageCache } from '@/hooks/useImageCache';

interface AlbumBackgroundProps {
  artwork: string;
  children: ReactNode;
}

export function AlbumBackground({ artwork, children }: AlbumBackgroundProps) {
  const { colors, isLoading } = useColorExtraction(artwork);
  const { getCachedCorsUrl, setCachedCorsUrl } = useImageCache();

  // Create CORS-safe image URL for background with caching and multiple proxy fallbacks
  const corsSafeImageUrl = useMemo(() => {
    if (!artwork) return artwork;
    
    // Check cache first
    const cachedUrl = getCachedCorsUrl(artwork);
    if (cachedUrl) {
      return cachedUrl;
    }
    
    // Use CORS proxy for external images to prevent CORS errors
    if (artwork.includes('doerfelverse.com') || artwork.includes('cloudfront.net') || artwork.includes('wavlake.com')) {
      // Try multiple proxies in order of reliability
      const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(artwork)}`,
        `https://cors-anywhere.herokuapp.com/${artwork}`,
        `https://thingproxy.freeboard.io/fetch/${artwork}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(artwork)}`
      ];
      
      // Use the first proxy as default, but cache it so we can try others if needed
      const proxyUrl = proxies[0];
      setCachedCorsUrl(artwork, proxyUrl);
      return proxyUrl;
    }
    return artwork;
  }, [artwork, getCachedCorsUrl, setCachedCorsUrl]);



  // Create accent colors for UI elements
  const getAccentStyles = () => {
    if (!colors) return {};
    
    return {
      '--album-primary': colors.primary,
      '--album-secondary': colors.secondary,
      '--album-accent': colors.accent,
      '--album-primary-50': colors.primary + '80', // 50% opacity
      '--album-primary-30': colors.primary + '4D', // 30% opacity
      '--album-primary-20': colors.primary + '33', // 20% opacity
      '--album-secondary-50': colors.secondary + '80',
      '--album-secondary-30': colors.secondary + '4D',
      '--album-accent-50': colors.accent + '80',
      '--album-accent-30': colors.accent + '4D',
    } as React.CSSProperties;
  };

  return (
    <div 
      className="min-h-screen bg-black text-white overflow-hidden relative"
      style={{
        ...getAccentStyles(),
        paddingTop: `env(safe-area-inset-top)`
      }}
    >
      {/* Album Art Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${corsSafeImageUrl})`,
          filter: 'brightness(0.15) saturate(1.2)',
        }}
      />
      
      {/* Dynamic Color Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${
          isLoading || !colors 
            ? 'from-black/60 via-black/70 to-black/90'
            : ''
        }`}
        style={
          colors && !isLoading
            ? {
                background: `linear-gradient(135deg, 
                  ${colors.primary}80 0%, 
                  ${colors.secondary}70 50%, 
                  ${colors.accent}60 70%,
                  #000000aa 100%)`
              }
            : {}
        }
      />
      

      
      {/* Subtle Pattern Overlay for Texture */}
      {colors && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary}20 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, ${colors.secondary}15 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, ${colors.accent}10 0%, transparent 50%)`
          }}
        />
      )}
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
} 