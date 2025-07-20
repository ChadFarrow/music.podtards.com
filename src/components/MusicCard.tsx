import { useState } from 'react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { V4VPaymentButton } from '@/components/V4VPaymentButton';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  audioUrl: string;
  duration: number;
  valueDestinations?: Array<{
    name: string;
    address: string;
    type: string;
    split: number;
  }>;
  podcastId: string;
  episodeId: string;
  feedUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  className?: string;
}

export function MusicCard({
  id,
  title,
  artist,
  artwork,
  audioUrl,
  duration,
  valueDestinations = [],
  podcastId,
  episodeId,
  feedUrl,
  isPlaying,
  onPlay,
  onPause,
  className
}: MusicCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Album Art with Play Button */}
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={artwork}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          width={300}
          height={300}
          fallback="🎵"
        />
        
        {/* Play/Pause Button Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className={cn(
              'opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 text-white rounded-full p-3 shadow-lg',
              isPlaying && 'opacity-100 scale-100'
            )}
            style={{
              background: 'var(--album-primary, #dc2626)',
              boxShadow: '0 0 20px var(--album-primary, #dc2626)40'
            }}
          >
            {isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} className="ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Track Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-300 mb-2">{artist}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>{formatDuration(duration)}</span>
          {valueDestinations.length > 0 && (
            <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded-full text-xs">
              {valueDestinations.length} recipient{valueDestinations.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* V4V Payment Button */}
        {valueDestinations.length > 0 && (
          <V4VPaymentButton
            valueDestinations={valueDestinations}
            feedUrl={feedUrl}
            episodeId={episodeId}
            contentTitle={title}
            feedId={podcastId}
          />
        )}
      </div>
    </div>
  );
} 