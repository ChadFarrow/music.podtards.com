import { useState } from 'react';
import { usePodcastPlayer } from '@/hooks/usePodcastPlayer';

// Album color schemes
const albumThemes = {
  citybeach: {
    name: "CityBeach",
    track: "Animosity",
    artist: "CityBeach",
    icon: "🎵",
    colors: {
      primary: '#40e0d0',
      secondary: '#4fb3d9',
      accent: '#5d8fef'
    }
  },
  sunset: {
    name: "Sunset Vibes",
    track: "Golden Hour",
    artist: "Solar Waves",
    icon: "🌅",
    colors: {
      primary: '#ff6b6b',
      secondary: '#ffa726',
      accent: '#ff8a65'
    }
  },
  forest: {
    name: "Forest Dreams",
    track: "Woodland Path",
    artist: "Nature's Echo",
    icon: "🌲",
    colors: {
      primary: '#4ecdc4',
      secondary: '#45b7aa',
      accent: '#26a69a'
    }
  },
  purple: {
    name: "Purple Haze",
    track: "Cosmic Dreams",
    artist: "Astral Vibes",
    icon: "🔮",
    colors: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      accent: '#663399'
    }
  }
};

export function ThemeDemo() {
  const [currentTheme, setCurrentTheme] = useState('citybeach');
  const { currentPodcast } = usePodcastPlayer();

  const changeAlbum = (albumKey: string) => {
    const theme = albumThemes[albumKey as keyof typeof albumThemes];
    if (!theme) return;

    setCurrentTheme(albumKey);

    // Update CSS variables globally
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(`--${property}-color`, value);
    });

    // Add a subtle animation to the now playing bar
    const nowPlayingBar = document.querySelector('.now-playing-bar');
    if (nowPlayingBar) {
      nowPlayingBar.setAttribute('style', 'transform: scale(0.98);');
      setTimeout(() => {
        nowPlayingBar.setAttribute('style', 'transform: scale(1);');
      }, 150);
    }
  };

  const currentThemeData = albumThemes[currentTheme as keyof typeof albumThemes];

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="flex gap-2">
        {Object.entries(albumThemes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => changeAlbum(key)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            style={{
              background: theme.colors.primary,
              color: key === 'sunset' ? 'white' : '#0f3460'
            }}
          >
            {theme.name}
          </button>
        ))}
      </div>
      
      {/* Demo content */}
      <div className="mt-4 p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold mb-2">{currentThemeData.name}</h3>
          <p className="text-sm text-white/70">
            Track: {currentThemeData.track} • Artist: {currentThemeData.artist}
          </p>
        </div>
      </div>
    </div>
  );
} 