import { useSeoMeta } from '@unhead/react';
import { AlbumGallery } from '@/components/AlbumGallery';
import { PodcastPlayer } from '@/components/PodcastPlayer';
import { NowPlayingBar } from '@/components/NowPlayingBar';
import { VersionDisplay } from '@/components/VersionDisplay';
import { Disc, Menu, X, Music as MusicIcon, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { FEATURED_ALBUMS } from '@/data/albums';

const Music = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { theme } = useTheme();

  const FEATURED_ALBUMS_WITH_DETAILS = FEATURED_ALBUMS;

  useSeoMeta({
    title: 'Music - Podtardstr',
    description: 'Discover and stream featured music with Value4Value Lightning payments on Podtardstr',
    ogTitle: 'Music - Podtardstr',
    ogDescription: 'Discover and stream featured music with Value4Value Lightning payments on Podtardstr',
    ogImage: '/icon-512.png',
    twitterCard: 'summary_large_image',
  });

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-black/80 to-transparent' 
          : 'bg-gradient-to-b from-white/95 to-white/60 backdrop-blur-sm shadow-sm'
      }`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              theme === 'dark'
                ? 'bg-black/50 hover:bg-black/70'
                : 'bg-white/80 hover:bg-white/95 shadow-sm border border-gray-200'
            }`}
          >
            {showMenu ? (
              <X size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-700'} />
            ) : (
              <Menu size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-700'} />
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme toggle removed - dark mode only */}
        </div>
      </div>

      {/* Slide-out Menu */}
      {showMenu && (
        <div className={`absolute top-0 left-0 h-full w-80 backdrop-blur-lg z-30 transform transition-transform duration-300 ${
          theme === 'dark' 
            ? 'bg-black/90' 
            : 'bg-white/95 shadow-xl border-r border-gray-200'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Navigation
              </h2>
              <button onClick={() => setShowMenu(false)}>
                <X size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-600'} />
              </button>
            </div>
            <nav className="space-y-2">
              <Link
                to="/music"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  theme === 'dark'
                    ? 'text-white bg-white/10'
                    : 'text-blue-600 bg-blue-50 border border-blue-200'
                }`}
              >
                <MusicIcon size={20} />
                <span className="font-medium">Music</span>
              </Link>
              
              <Link
                to="/albums"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Disc size={20} />
                <span className="font-medium">Albums</span>
              </Link>
              

              

            </nav>
            
            <div className="absolute bottom-6 left-6 right-6">
              <VersionDisplay />
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Vibed with <a 
                  href="https://soapbox.pub/mkstack" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`hover:underline ${
                    theme === 'dark' ? 'text-primary' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  MKStack
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 pt-16 pb-24">
        <div className={`text-center py-16 px-4 ${
          theme === 'dark' ? '' : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
              }`}>
                <MusicIcon size={48} className="text-white" />
              </div>
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Discover Music
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Stream and support independent artists with Value4Value Lightning payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/albums/bloodshot-lies"
                className={`px-8 py-3 text-white font-semibold rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                }`}
              >
                Featured Album
              </Link>
              <Link
                to="/albums"
                className={`px-8 py-3 font-semibold rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'border border-white/20 text-white hover:bg-white/10'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 shadow-sm'
                }`}
              >
                Browse All Albums
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Albums */}
        <div className={theme === 'dark' ? '' : 'bg-white'}>
          <AlbumGallery albums={FEATURED_ALBUMS_WITH_DETAILS} />
        </div>
      </div>

      {/* Audio Player */}
      <NowPlayingBar />
    </div>
  );
};

export default Music;