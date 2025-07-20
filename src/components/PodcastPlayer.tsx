import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { usePodcastPlayer } from '@/hooks/usePodcastPlayer';
import { NowPlayingModal } from '@/components/NowPlayingModal';
import { useAlbumColors } from '@/hooks/useAlbumColors';
import { useColorExtraction } from '@/hooks/useColorExtraction';

export function PodcastPlayer() {
  const { 
    currentPodcast, 
    isPlaying, 
    setIsPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsMuted,
    playNext,
    playPrevious,
    playNextAuto,
    autoPlay,
    setAutoPlay
  } = usePodcastPlayer();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [loadedPodcastId, setLoadedPodcastId] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const albumColors = useAlbumColors();

  // Extract colors from current podcast artwork
  const { colors, isLoading } = useColorExtraction(currentPodcast?.imageUrl);

  // Default color scheme (CityBeach theme)
  const defaultColors = {
    primary: '#40e0d0',
    secondary: '#4fb3d9',
    accent: '#5d8fef',
    primaryLight: '#48e6d6',
    secondaryLight: '#55b9df',
    darkBg: '#0f3460',
    glow: 'rgba(64, 224, 208, 0.4)',
    hover: 'rgba(64, 224, 208, 0.1)'
  };

  // Use extracted colors or fall back to album colors or defaults
  const themeColors = colors || albumColors || defaultColors;

  // CSS custom properties style object
  const customProperties = {
    '--primary-color': themeColors.primary,
    '--secondary-color': themeColors.secondary,
    '--accent-color': themeColors.accent,
    '--primary-light': themeColors.primary,
    '--secondary-light': themeColors.secondary,
    '--dark-bg': '#0f3460',
    '--glow-color': 'rgba(64, 224, 208, 0.4)',
    '--hover-bg': 'rgba(64, 224, 208, 0.1)'
  } as React.CSSProperties;

  // Detect iOS
  useEffect(() => {
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent;
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
      setIsIOS(isIOSDevice);
    };
    detectIOS();
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const time = audio.currentTime;
      const dur = audio.duration;
      
      if (!isNaN(time)) setCurrentTime(time);
      if (!isNaN(dur) && dur !== Infinity) setDuration(dur);
    };

    const handleEnded = () => {
      if (autoPlay) {
        playNextAuto();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [autoPlay, playNextAuto, setCurrentTime, setDuration, setIsPlaying]);

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && hasUserInteracted) {
      audio.play().catch(error => {
        console.log('Autoplay prevented:', error);
        setAutoplayBlocked(true);
        setIsPlaying(false);
      });
    } else if (!isPlaying) {
      audio.pause();
    }
  }, [isPlaying, hasUserInteracted, setIsPlaying]);

  // Handle new track loading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentPodcast) return;
    
    if (loadedPodcastId !== currentPodcast.id) {
      audio.src = currentPodcast.url;
      setLoadedPodcastId(currentPodcast.id);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentPodcast, loadedPodcastId, setCurrentTime, setDuration]);

  // Volume control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Format time helper
  const formatTime = (time: number): string => {
    if (!time || isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const handlePlayPause = () => {
    setHasUserInteracted(true);
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume bar click
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    setVolume(percentage);
    setIsMuted(false);
  };

  // Handle volume button
  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = isMuted ? 0 : volume * 100;

  if (!currentPodcast) {
    return null;
  }

  return (
    <>
      <style>{`
        .now-playing-bar {
          --primary-color: ${themeColors.primary};
          --secondary-color: ${themeColors.secondary};
          --accent-color: ${themeColors.accent};
          --primary-light: ${themeColors.primary};
          --secondary-light: ${themeColors.secondary};
          --dark-bg: #0f3460;
          --glow-color: rgba(64, 224, 208, 0.4);
          --hover-bg: rgba(64, 224, 208, 0.1);
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          right: -2px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: var(--primary-color);
          border-radius: 50%;
          box-shadow: 0 2px 6px var(--glow-color);
          opacity: 0;
          transition: opacity 0.2s ease, background 0.5s ease, box-shadow 0.5s ease;
        }

        .progress-bar:hover .progress-fill::after {
          opacity: 1;
        }

        .album-art {
          transition: all 0.5s ease;
        }

        .now-playing-bar {
          transition: transform 0.3s ease;
        }

        .now-playing-bar:hover {
          transform: scale(1.01);
        }
      `}</style>

      <div 
        className="now-playing-bar fixed bottom-0 left-0 right-0 z-50 w-full bg-black/95 backdrop-blur-[20px] border-t border-white/20 flex items-center gap-5 px-6 py-3 overflow-hidden transition-transform duration-300"
        style={{
          background: 'rgba(15, 52, 96, 0.95)',
          borderTopColor: 'rgba(64, 224, 208, 0.2)',
          paddingBottom: `max(0.75rem, env(safe-area-inset-bottom))`,
          paddingLeft: `max(1.5rem, env(safe-area-inset-left))`,
          paddingRight: `max(1.5rem, env(safe-area-inset-right))`,
          ...customProperties
        }}
      >
        {/* Top gradient line */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5 opacity-60 transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color))`
          }}
        />

        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer" onClick={() => setShowNowPlaying(true)}>
          <div 
            className="album-art w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-500 shadow-lg"
            style={{
              background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
              boxShadow: `0 4px 12px var(--glow-color)`
            }}
          >
            {currentPodcast.imageUrl ? (
              <img 
                src={currentPodcast.imageUrl} 
                alt={currentPodcast.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Music className={`${currentPodcast.imageUrl ? 'hidden' : ''} text-white`} size={24} />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="text-white text-base font-semibold truncate mb-0.5">
              {currentPodcast.title}
            </div>
            <div className="text-white/70 text-sm truncate">
              {currentPodcast.author}
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <button
            onClick={playPrevious}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 flex items-center justify-center"
            style={{'--hover-bg': 'var(--hover-bg)'} as React.CSSProperties}
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 mx-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
              color: 'var(--dark-bg)',
              boxShadow: `0 4px 12px var(--glow-color)`
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={playNext}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 flex items-center justify-center"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Progress Section */}
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <div className="text-white/60 text-xs min-w-[40px] text-center">
            {formatTime(currentTime)}
          </div>
          
          <div 
            className="progress-bar flex-1 h-1.5 bg-white/10 rounded-full relative cursor-pointer overflow-hidden group"
            onClick={handleProgressClick}
          >
            <div 
              className="progress-fill h-full rounded-full relative transition-all duration-100"
              style={{
                background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color))`,
                width: `${progressPercentage}%`
              }}
            />
          </div>
          
          <div className="text-white/60 text-xs min-w-[40px] text-center">
            {formatTime(duration)}
          </div>
        </div>

        {/* Volume & Auto-play */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <button
            onClick={handleVolumeToggle}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <div 
            className="w-20 h-1 bg-white/10 rounded-full relative cursor-pointer"
            onClick={handleVolumeClick}
          >
            <div 
              className="h-full rounded-full transition-all duration-100"
              style={{
                background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color))`,
                width: `${volumePercentage}%`
              }}
            />
          </div>
          
          <div 
            className={`relative w-10 h-5 rounded-full cursor-pointer transition-all duration-300 ml-2 ${
              autoPlay ? 'bg-gradient-to-r' : 'bg-white/10'
            }`}
            style={autoPlay ? {
              background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color))`
            } : undefined}
            onClick={() => setAutoPlay(!autoPlay)}
          >
            <div 
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                autoPlay ? 'transform translate-x-5' : 'transform translate-x-0.5'
              }`}
            />
          </div>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} preload="metadata" />
      </div>

      {/* Now Playing Modal */}
      {showNowPlaying && (
        <NowPlayingModal 
          isOpen={showNowPlaying} 
          onClose={() => setShowNowPlaying(false)} 
        />
      )}
    </>
  );
}