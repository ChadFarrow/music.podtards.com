import { AlbumViewEnhanced } from '@/components/AlbumViewEnhanced';
import { PodcastPlayer } from '@/components/PodcastPlayer';
import { Home, Disc, Menu, X, Sun, Moon, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';

interface AlbumsProps {
  feedUrl?: string;
}

const Albums = ({ feedUrl }: AlbumsProps) => {
  const [searchParams] = useSearchParams();
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Mobile detection
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  }, []);
  
  // Get feed URL from props first, then from query parameters
  const feedUrlFromParams = searchParams.get('feed');
  const currentFeedUrl = feedUrl || feedUrlFromParams || undefined;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Featured albums data
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Disc className="h-8 w-8 text-red-500" />
                <span className="text-xl font-bold">Podtardstr</span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/albums" className="text-white font-semibold">
                  Albums
                </Link>
              </nav>
            </div>

            {/* Right side - Theme toggle and menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
              onClick={() => setShowMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/albums"
              className="block px-3 py-2 text-white bg-gray-800 rounded-md"
              onClick={() => setShowMenu(false)}
            >
              Albums
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Album Selector */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">All Albums</h1>
          <div className="flex flex-wrap gap-3">
            {FEATURED_ALBUMS.map((album) => (
              <button
                key={album.id}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('feed', album.feedUrl);
                  window.history.pushState({}, '', url.toString());
                  window.location.reload();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  currentFeedUrl === album.feedUrl
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                }`}
              >
                <Disc className="h-4 w-4" />
                <span className="truncate max-w-32">{album.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Album Display */}
        {currentFeedUrl ? (
          <AlbumViewEnhanced feedUrl={currentFeedUrl} />
        ) : (
          <div className="text-center py-12">
            <Music className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Select an Album</h2>
            <p className="text-gray-500">Choose an album from the list above to start listening</p>
          </div>
        )}
      </main>

      {/* Audio Player */}
      <PodcastPlayer />
    </div>
  );
};

export default Albums; 