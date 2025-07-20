import { ImageWithFallback } from './ImageWithFallback';
import { cn } from '@/lib/utils';

interface AlbumHeroProps {
  title: string;
  artist: string;
  artwork: string;
  description?: string;
  className?: string;
}

export function AlbumHero({ 
  title, 
  artist, 
  artwork, 
  description, 
  className 
}: AlbumHeroProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <div className="aspect-square relative">
        {artwork ? (
          <ImageWithFallback
            src={artwork}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
            width={800}
            height={800}
            fallback="🎵"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-6xl text-gray-600">🎵</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-xl text-gray-300 mb-3">{artist}</p>
        {description && (
          <p className="text-gray-400 max-w-2xl">{description}</p>
        )}
      </div>
    </div>
  );
}
