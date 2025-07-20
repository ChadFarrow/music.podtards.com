import { useNavigate } from 'react-router-dom';
import { SecureImage } from '@/components/SecureImage';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Play } from 'lucide-react';
import type { PodRollItem } from '@/lib/feed-parser';

interface PublisherAlbumsProps {
  albums?: PodRollItem[];
  currentFeedUrl?: string;
}

export function PublisherAlbums({ albums, currentFeedUrl }: PublisherAlbumsProps) {
  const navigate = useNavigate();

  if (!albums || albums.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Albums by this Artist</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="w-full h-32 mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Filter out the current feed and limit to 12 items
  const otherAlbums = albums
    .filter(album => album.feedUrl !== currentFeedUrl)
    .slice(0, 12);

  if (otherAlbums.length === 0) {
    return null;
  }

  const getAlbumRoute = (feedUrl: string) => {
    // Extract album ID from feed URL for routing
    const albumId = feedUrl.split('/').pop()?.replace('.xml', '') || 'custom';
    return `/albums/${albumId}?feed=${encodeURIComponent(feedUrl)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Albums by this Artist</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {otherAlbums.map((album, index) => (
          <Card 
            key={album.feedGuid || index}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            onClick={() => {
              if (album.feedUrl) {
                const route = getAlbumRoute(album.feedUrl);
                navigate(route);
              }
            }}
          >
            <div className="relative aspect-square overflow-hidden">
              {album.image ? (
                <SecureImage
                  src={album.image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Music className="w-12 h-12 text-gray-600" />
                </div>
              )}
              
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                {album.title}
              </h4>
              {album.author && (
                <p className="text-xs text-gray-400 line-clamp-1">
                  {album.author}
                </p>
              )}
              {album.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {album.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 