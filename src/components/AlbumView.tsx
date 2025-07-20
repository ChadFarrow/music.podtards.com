import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { TrackList } from '@/components/TrackList';
import { PodcastPlayer } from '@/components/PodcastPlayer';
import { useAlbumFeed } from '@/hooks/useAlbumFeed';
import { cn } from '@/lib/utils';

interface AlbumViewProps {
  className?: string;
}

export function AlbumView({ className }: AlbumViewProps) {
  const { albumSlug } = useParams<{ albumSlug: string }>();
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [customFeedUrl, setCustomFeedUrl] = useState<string>('');

  useEffect(() => {
    if (albumSlug) {
      setSelectedAlbum(albumSlug);
    }
  }, [albumSlug]);

  // Find the feed URL for the selected album
  const getFeedUrl = (albumId: string) => {
    const FEATURED_ALBUMS = [
      {
        id: 'bloodshot-lies',
        title: 'Bloodshot Lies - The Album',
        artist: 'The Doerfels',
        feedUrl: 'https://www.doerfelverse.com/feeds/bloodshot-lies-album.xml',
      },
      {
        id: 'heycitizen-experience',
        title: 'The HeyCitizen Experience',
        artist: 'HeyCitizen',
        feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/The-Heycitizen-Experience/the heycitizen experience.xml',
      },
      {
        id: 'think-ep',
        title: 'Think EP',
        artist: 'The Doerfels',
        feedUrl: 'https://www.doerfelverse.com/feeds/think-ep.xml',
      },
      {
        id: 'music-from-the-doerfelverse',
        title: 'Music From The Doerfel-Verse',
        artist: 'The Doerfels',
        feedUrl: 'https://www.doerfelverse.com/feeds/music-from-the-doerfelverse.xml',
      },
      {
        id: 'stay-awhile',
        title: 'Stay Awhile',
        artist: 'Able and The Wolf',
        feedUrl: 'https://ableandthewolf.com/static/media/feed.xml',
      },
      {
        id: 'spectral-hiding',
        title: 'Spectral Hiding',
        artist: 'Bitpunk.fm',
        feedUrl: 'https://zine.bitpunk.fm/feeds/spectral-hiding.xml',
      },
      {
        id: 'polar-embrace',
        title: 'Polar Embrace',
        artist: 'The Satellite Skirmish',
        feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/polarembrace/rss/videofeed/feed.xml',
      },
      {
        id: 'autumn-rust',
        title: 'Autumn Rust',
        artist: 'The Satellite Skirmish',
        feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/autumnrust/mp3s/album_feed/feed.xml',
      },
      {
        id: 'the-satellite-skirmish-album',
        title: 'The Satellite Skirmish',
        artist: 'Various Artists',
        feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/the_satellite_skirmish_album.xml',
      },
      {
        id: 'lofi-experience',
        title: 'HeyCitizen\'s Lo-Fi Hip-Hop Beats to Study and Relax to',
        artist: 'HeyCitizen',
        feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/Lofi-Experience/lofi.xml',
      },
      {
        id: 'tinderbox',
        title: 'Tinderbox',
        artist: 'Nate Johnivan',
        feedUrl: 'https://wavlake.com/feed/music/d677db67-0310-4813-970e-e65927c689f1',
      },
      {
        id: 'deathdreams',
        title: 'deathdreams',
        artist: 'Survival Guide (Emily Whitehurst)',
        feedUrl: 'https://static.staticsave.com/mspfiles/deathdreams.xml',
      },
      {
        id: 'pony-up-daddy',
        title: 'Pony Up Daddy',
        artist: '$2 Holla',
        feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Mike_Epting/$2Holla/pony%20up%20daddy.xml',
      },
      {
        id: 'empty-passenger-seat',
        title: 'Empty Passenger Seat',
        artist: 'White Rabbit Records',
        feedUrl: 'https://whiterabbitrecords.org/wp-content/uploads/2023/04/Empty-Passenger-Seat.xml',
      },
    ];

    const album = FEATURED_ALBUMS.find(a => a.id === albumId);
    return album?.feedUrl || customFeedUrl;
  };

  const feedUrl = getFeedUrl(selectedAlbum);
  const { data: album, isLoading: loading, error } = useAlbumFeed(feedUrl, { enabled: !!feedUrl });

  if (loading) {
    return (
      <div className={cn('min-h-screen bg-black text-white p-8', className)}>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="w-80 h-80 bg-gray-800 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="h-6 bg-gray-800 rounded mb-2"></div>
            <div className="h-6 bg-gray-800 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className={cn('min-h-screen bg-black text-white p-8', className)}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
          <p className="text-gray-400">The album you're looking for could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-black text-white', className)}>
      {/* Album Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={album.artwork}
            alt={album.title}
            className="w-full h-full object-cover"
            width={1200}
            height={600}
            fallback="🎵"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 p-8 pt-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              {/* Album Art */}
              <div className="lg:col-span-1">
                <div className="w-80 h-80 mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={album.artwork}
                    alt={album.title}
                    className="w-full h-full object-cover"
                    width={320}
                    height={320}
                    fallback="🎵"
                  />
                </div>
              </div>
              
              {/* Album Info */}
              <div className="lg:col-span-2 text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4">{album.title}</h1>
                <p className="text-xl lg:text-2xl text-gray-300 mb-6">{album.artist}</p>
                {album.description && (
                  <p className="text-gray-400 max-w-2xl mb-6">{album.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="bg-black/50 px-3 py-1 rounded-full">
                    {album.tracks.length} tracks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <TrackList
            tracks={album.tracks}
            artist={album.artist}
            onTrackPlay={(track) => {
              console.log('Play track clicked');
              // TODO: Implement track playback functionality
            }}
            isTrackPlaying={(track) => {
              // TODO: Implement track playing state check
              return false;
            }}
          />
        </div>
      </div>

      {/* Audio Player */}
      <PodcastPlayer />
    </div>
  );
}