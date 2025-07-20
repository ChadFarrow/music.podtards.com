import { usePublisherFeed } from '@/hooks/useAlbumFeed';
import { useNavigate } from 'react-router-dom';
import { SecureImage } from '@/components/SecureImage';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Play } from 'lucide-react';
import type { PublisherFeed } from '@/hooks/useAlbumFeed';

interface PublisherFeedItemsProps {
  publisherFeed?: PublisherFeed;
  currentFeedUrl?: string;
}

export function PublisherFeedItems({ publisherFeed, currentFeedUrl }: PublisherFeedItemsProps) {
  const navigate = useNavigate();
  const { data: publisherData, isLoading, error } = usePublisherFeed(publisherFeed, {
    enabled: !!publisherFeed?.feedUrl && publisherFeed.feedUrl !== currentFeedUrl
  });

  if (!publisherFeed?.feedUrl) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">More from this Publisher</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

  if (error || !publisherData) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">More from this Publisher</h3>
        <p className="text-muted-foreground">Unable to load publisher content</p>
      </div>
    );
  }

  // Filter out the current feed and limit to 8 items
  const otherItems = publisherData.episodes
    .filter(item => item.link !== currentFeedUrl)
    .slice(0, 8);

  if (otherItems.length === 0) {
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
        <h3 className="text-xl font-semibold">More from {publisherData.title || 'this Publisher'}</h3>
        <a
          href={publisherFeed.feedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View all →
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {otherItems.map((item, index) => (
          <Card 
            key={item.guid || index}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            onClick={() => {
              if (item.link) {
                const route = getAlbumRoute(item.link);
                navigate(route);
              }
            }}
          >
            <CardContent className="p-4">
              <div className="relative mb-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {item.image ? (
                    <SecureImage
                      src={item.image}
                      alt={item.title || 'Album cover'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Music className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title || 'Untitled'}
                </h4>
                {item.pubDate && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.pubDate).getFullYear()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 