import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { usePodcastPlayer } from '@/hooks/usePodcastPlayer';
import { useColorExtraction } from '@/hooks/useColorExtraction';

export function NowPlayingBar() {
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
    autoPlay,
    setAutoPlay
  } = usePodcastPlayer();

  const audioRef = useRef<HTMLAudioElement>(null);

  const { colors } = useColorExtraction(currentPodcast?.imageUrl);
  
  // Default CityBeach theme colors
  const defaultColors = {
    primary: '#40e0d0',
    secondary: '#4fb3d9',
    accent: '#5d8fef',
    primaryLight: '#48e6d6',
    secondaryLight: '#55b9df',
    darkBg: '#0f3460',
    glowColor: 'rgba(64, 224, 208, 0.4)',
    hoverBg: 'rgba(64, 224, 208, 0.1)'
  };

  // Use extracted colors or fall back to defaults
  const themeColors = colors ? {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    primaryLight: colors.primary,
    secondaryLight: colors.secondary,
    darkBg: colors.primary,
    glowColor: `${colors.primary}66`,
    hoverBg: `${colors.primary}1A`
  } : defaultColors;

  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // Handle audio effects
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [setCurrentTime, setDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentPodcast) return;

    audio.src = currentPodcast.url;
    setCurrentTime(0);
    setDuration(0);
  }, [currentPodcast?.url, setCurrentTime, setDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (!progressBar || !duration || !audio) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;
    const newTime = (percentage / 100) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = volumeBarRef.current;
    if (!volumeBar) return;

    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (clickX / width) * 100));
    
    setVolume(percentage / 100);
    if (percentage > 0) {
      setIsMuted(false);
    }
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleAutoPlayToggle = () => {
    setAutoPlay(!autoPlay);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = isMuted ? 0 : volume * 100;

  // CSS custom properties for theming
  const customProperties = {
    '--primary-color': themeColors.primary,
    '--secondary-color': themeColors.secondary,
    '--accent-color': themeColors.accent,
    '--primary-light': themeColors.primaryLight,
    '--secondary-light': themeColors.secondaryLight,
    '--dark-bg': themeColors.darkBg,
    '--glow-color': themeColors.glowColor,
    '--hover-bg': themeColors.hoverBg,
  } as React.CSSProperties;

  if (!currentPodcast) {
    return null;
  }

  return (
    <div 
      className="now-playing-bar fixed bottom-0 left-0 right-0 z-50"
      style={{
        ...customProperties,
        width: '100%',
        background: 'rgba(15, 52, 96, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--primary-color)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        controls={false}
        style={{ display: 'none' }}
      />
      {/* Top gradient line */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color))`,
          opacity: 0.6
        }}
      />

      {/* Track Info */}
      <div className="track-info flex items-center gap-4 min-w-0 flex-1">
        <div 
          className="album-art flex items-center justify-center text-2xl flex-shrink-0 rounded-lg"
          style={{
            width: '56px',
            height: '56px',
            background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
            boxShadow: '0 4px 12px var(--glow-color)',
            transition: 'all 0.5s ease'
          }}
        >
          {currentPodcast.imageUrl ? (
            <img 
              src={currentPodcast.imageUrl} 
              alt={currentPodcast.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            '🎵'
          )}
        </div>
        <div className="track-details min-w-0 flex-1">
          <div 
            className="track-title font-semibold text-white text-base mb-0.5"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {currentPodcast.title}
          </div>
          <div 
            className="track-artist text-sm"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {currentPodcast.author}
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="player-controls flex items-center gap-2 flex-1 justify-center">
        <button 
          onClick={playPrevious}
          className="control-btn flex items-center justify-center p-2 rounded-full transition-all duration-200"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-color)';
            e.currentTarget.style.background = 'var(--hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <SkipBack size={20} />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="play-pause-btn flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
            color: 'var(--dark-bg)',
            width: '48px',
            height: '48px',
            margin: '0 12px',
            boxShadow: '0 4px 12px var(--glow-color)',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, var(--primary-light), var(--secondary-light))`;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button 
          onClick={playNext}
          className="control-btn flex items-center justify-center p-2 rounded-full transition-all duration-200"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-color)';
            e.currentTarget.style.background = 'var(--hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Progress Section */}
      <div className="progress-section flex items-center gap-3 flex-1 max-w-xs">
        <div className="time text-xs text-center min-w-10" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {formatTime(currentTime)}
        </div>
        <div 
          ref={progressBarRef}
          className="progress-bar flex-1 h-1.5 rounded-sm relative cursor-pointer overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          onClick={handleProgressClick}
        >
          <div 
            className="progress-fill h-full rounded-sm relative transition-all duration-100"
            style={{
              background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color))`,
              width: `${progressPercentage}%`
            }}
          >
            <div 
              className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full opacity-0 transition-opacity duration-200 hover:opacity-100"
              style={{
                background: 'var(--primary-color)',
                boxShadow: '0 2px 6px var(--glow-color)'
              }}
            />
          </div>
        </div>
        <div className="time text-xs text-center min-w-10" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {formatTime(duration)}
        </div>
      </div>

      {/* Volume & Auto-play */}
      <div className="volume-section flex items-center gap-2 min-w-30">
        <button 
          onClick={handleVolumeToggle}
          className="control-btn flex items-center justify-center p-2 rounded-full transition-all duration-200"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-color)';
            e.currentTarget.style.background = 'var(--hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.background = 'none';
          }}
        >
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
        <div 
          ref={volumeBarRef}
          className="volume-bar w-20 h-1 rounded-sm relative cursor-pointer"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          onClick={handleVolumeClick}
        >
          <div 
            className="volume-fill h-full rounded-sm transition-all duration-100"
            style={{
              background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color))`,
              width: `${volumePercentage}%`
            }}
          />
        </div>
        
        <div 
          className="auto-play-toggle relative w-10 h-5 rounded-full cursor-pointer transition-all duration-300 ml-2"
          style={{
            background: autoPlay 
              ? `linear-gradient(90deg, var(--primary-color), var(--secondary-color))` 
              : 'rgba(255, 255, 255, 0.1)'
          }}
          onClick={handleAutoPlayToggle}
        >
          <div 
            className="toggle-slider absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300"
            style={{
              left: '2px',
              transform: autoPlay ? 'translateX(20px)' : 'translateX(0)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          />
        </div>
      </div>

      <style>{`
        .now-playing-bar .progress-bar:hover .progress-fill::after {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .now-playing-bar {
            gap: 12px;
            padding: 8px 16px;
          }
          
          .progress-section {
            max-width: 200px;
          }
          
          .volume-section {
            min-width: 80px;
          }
          
          .volume-bar {
            width: 60px;
          }
        }
      `}</style>
    </div>
  );
}