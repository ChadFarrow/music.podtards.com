import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AlbumGallery } from '@/components/AlbumGallery';
import { AlbumViewEnhanced } from '@/components/AlbumViewEnhanced';
import { PodcastPlayer } from '@/components/PodcastPlayer';
import { ScrollToTop } from '@/components/ScrollToTop';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 2 * 60 * 60 * 1000, // 2 hours
      retry: 2,
      retryDelay: 1000,
    },
  },
});

// Featured albums data
const FEATURED_ALBUMS = [
  {
    id: 'bloodshot-lies',
    title: 'Bloodshot Lies - The Album',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/bloodshot-lies-the-album.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/bloodshot-lies-album.xml',
    description: 'A powerful collection of rock anthems exploring themes of deception and resilience.'
  },
  {
    id: 'heycitizen-experience',
    title: 'The HeyCitizen Experience',
    artist: 'HeyCitizen',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/The-Heycitizen-Experience/The-Heycitizen-Experience.jpg',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/The-Heycitizen-Experience/the heycitizen experience.xml',
    description: 'An experimental journey through electronic soundscapes and indie vibes.'
  },
  {
    id: 'think-ep',
    title: 'Think EP',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/think-ep.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/think-ep.xml',
    description: 'A contemplative EP that challenges conventional thinking through melodic storytelling.'
  },
  {
    id: 'music-from-the-doerfelverse',
    title: 'Music From The Doerfel-Verse',
    artist: 'The Doerfels',
    artwork: 'https://www.doerfelverse.com/art/carol-of-the-bells.png',
    feedUrl: 'https://www.doerfelverse.com/feeds/music-from-the-doerfelverse.xml',
    description: 'A diverse collection spanning the musical universe of The Doerfels.'
  },
  {
    id: 'stay-awhile',
    title: 'Stay Awhile',
    artist: 'Able and The Wolf',
    artwork: 'https://ableandthewolf.com/static/media/01_MakinBeans.6dfb9c8e18b0f28adf4d.jpg',
    feedUrl: 'https://ableandthewolf.com/static/media/feed.xml',
    description: 'Intimate acoustic sessions that invite listeners to pause and reflect.'
  },
  {
    id: 'spectral-hiding',
    title: 'Spectral Hiding',
    artist: 'Bitpunk.fm',
    artwork: 'https://files.bitpunk.fm/spectral_hiding.png',
    feedUrl: 'https://zine.bitpunk.fm/feeds/spectral-hiding.xml',
    description: 'Ethereal electronic compositions that blur the line between digital and organic.'
  },
  {
    id: 'polar-embrace',
    title: 'Polar Embrace',
    artist: 'The Satellite Skirmish',
    artwork: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/polarembrace/art/Polar-Embrace-Feed-art-hires.gif',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/polarembrace/rss/videofeed/feed.xml',
    description: 'Ambient soundscapes inspired by arctic solitude and cosmic wonder.'
  },
  {
    id: 'autumn-rust',
    title: 'Autumn Rust',
    artist: 'The Satellite Skirmish',
    artwork: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/autumnrust/art/Autumn-Rust-Feed-Art.gif',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/autumnrust/mp3s/album_feed/feed.xml',
    description: 'Melancholic melodies capturing the beauty of seasonal transformation.'
  },
  {
    id: 'the-satellite-skirmish-album',
    title: 'The Satellite Skirmish',
    artist: 'Various Artists',
    artwork: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/art/the%20satellite%20skirmish%20mku.gif',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/the_satellite_skirmish_album.xml',
    description: 'A collaborative collection featuring diverse artists from the Satellite Skirmish collective.'
  },
  {
    id: 'lofi-experience',
    title: 'HeyCitizen\'s Lo-Fi Hip-Hop Beats to Study and Relax to',
    artist: 'HeyCitizen',
    artwork: 'https://files.heycitizen.xyz/Songs/Albums/Lofi-Experience/Lofi-Experience.png',
    feedUrl: 'https://files.heycitizen.xyz/Songs/Albums/Lofi-Experience/lofi.xml',
    description: 'Chill beats perfect for focus, relaxation, and late-night coding sessions.'
  },
  {
    id: 'tinderbox',
    title: 'Tinderbox',
    artist: 'Nate Johnivan',
    artwork: 'https://d12wklypp119aj.cloudfront.net/image/d677db67-0310-4813-970e-e65927c689f1.jpg',
    feedUrl: 'https://wavlake.com/feed/music/d677db67-0310-4813-970e-e65927c689f1',
    description: 'Raw, emotional tracks that ignite the soul and challenge conventions.'
  },
  {
    id: 'deathdreams',
    title: 'deathdreams',
    artist: 'Survival Guide (Emily Whitehurst)',
    artwork: 'https://static.wixstatic.com/media/484406_9138bd56c7b64a388da3b927a5bb2220~mv2.png',
    feedUrl: 'https://static.staticsave.com/mspfiles/deathdreams.xml',
    description: 'Haunting melodies exploring the darker corners of the human experience.'
  },
  {
    id: 'pony-up-daddy',
    title: 'Pony Up Daddy',
    artist: '$2 Holla',
    artwork: 'https://f4.bcbits.com/img/a1480089316_16.jpg',
    feedUrl: 'https://music.behindthesch3m3s.com/wp-content/uploads/Mike_Epting/$2Holla/pony%20up%20daddy.xml',
    description: 'High-energy beats and clever wordplay that demand attention.'
  },
  {
    id: 'empty-passenger-seat',
    title: 'Empty Passenger Seat',
    artist: 'Joe Martin',
    artwork: 'https://d12wklypp119aj.cloudfront.net/image/95ea253a-4058-402c-8503-204f6d3f1494.jpg',
    feedUrl: 'https://www.wavlake.com/feed/95ea253a-4058-402c-8503-204f6d3f1494',
    description: 'Indie rock journeys through solitude and self-discovery.'
  }
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-black text-white">
            <Routes>
              {/* Main albums gallery */}
              <Route path="/" element={<AlbumGallery albums={FEATURED_ALBUMS} />} />
              
              {/* Individual album pages */}
              {FEATURED_ALBUMS.map((album) => (
                <Route
                  key={album.id}
                  path={`/albums/${album.id}`}
                  element={<AlbumViewEnhanced feedUrl={album.feedUrl} />}
                />
              ))}
              
              {/* Fallback route */}
              <Route path="*" element={<AlbumGallery albums={FEATURED_ALBUMS} />} />
            </Routes>
            
            {/* Global audio player */}
            <PodcastPlayer />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
