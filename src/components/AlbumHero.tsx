import { Play, Pause } from 'lucide-react';
import { SecureImage } from '@/components/SecureImage';
import { htmlToText } from '@/lib/html-utils';
import { FundingButton } from '@/components/FundingButton';
import { useNavigate } from 'react-router-dom';

interface FundingInfo {
  url: string;
  message: string;
}

interface PublisherFeed {
  feedGuid?: string;
  feedUrl?: string;
}

interface AlbumHeroProps {
  title: string;
  artist: string;
  artwork: string;
  description?: string;
  publisher?: string;
  publisherFeed?: PublisherFeed;
  trackCount: number;
  totalDuration: number;
  currentYear: number;
  isPlaying: boolean;
  funding?: FundingInfo;
  onPlayAlbum: () => void;
}

export function AlbumHero({
  title,
  artist,
  artwork,
  description,
  publisher,
  publisherFeed,
  trackCount,
  totalDuration,
  currentYear,
  isPlaying,
  funding,
  onPlayAlbum
}: AlbumHeroProps) {
  const navigate = useNavigate();
  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div 
      className="flex-1 flex items-center justify-center py-8 pt-20"
      style={{
        paddingLeft: `max(2rem, env(safe-area-inset-left))`,
        paddingRight: `max(2rem, env(safe-area-inset-right))`,
        paddingTop: `max(5rem, env(safe-area-inset-top) + 2rem)`
      }}
    >
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Album Art - Large Display */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={onPlayAlbum}>
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl shadow-2xl overflow-hidden relative">
                <SecureImage
                  src={artwork}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Always visible play indicator in corner */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <Play size={20} className="text-white" />
                </div>
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <button 
                    className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-500 text-white rounded-full p-6 shadow-2xl"
                    style={{
                      background: `var(--album-primary, #dc2626)`,
                      boxShadow: `0 0 30px var(--album-primary, #dc2626)40`
                    }}
                  >
                    {isPlaying ? (
                      <Pause size={40} />
                    ) : (
                      <Play size={40} className="ml-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            

          </div>
          
          {/* Album Details */}
          <div className="text-center lg:text-left space-y-6">
            <div>
              <p 
                className="font-semibold tracking-wider uppercase text-sm mb-2"
                style={{ color: `var(--album-accent, #f87171)` }}
              >
                Featured Album
              </p>
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 leading-tight">{title}</h1>
              <h2 className="text-2xl lg:text-3xl text-gray-300 font-light mb-2">{artist}</h2>
              {publisher && (
                <p className="text-lg text-gray-400 font-light mb-2">Published by {publisher}</p>
              )}
              {publisherFeed && (
                <p className="text-lg text-gray-400 font-light mb-6">
                  Part of <button 
                    onClick={() => {
                      if (publisherFeed.feedUrl) {
                        // Navigate to the publisher feed within the app
                        const route = `/albums/publisher?feed=${encodeURIComponent(publisherFeed.feedUrl)}`;
                        navigate(route);
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                  >
                    publisher catalog
                  </button>
                </p>
              )}
            </div>
            
            {description && (
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                {htmlToText(description)}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-400">
              <span className="bg-black/50 px-3 py-1 rounded-full">{currentYear}</span>
              <span className="bg-black/50 px-3 py-1 rounded-full">{trackCount} tracks</span>
              <span className="bg-black/50 px-3 py-1 rounded-full">{formatTotalDuration(totalDuration)}</span>
            </div>
            
            {funding && (
              <div className="flex justify-center lg:justify-start pt-4">
                <FundingButton funding={funding} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 