import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, 
  Disc, 
  Folder, 
  Crown, 
  Music,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar-utils';
import { useColorExtraction } from '@/hooks/useColorExtraction';
import { usePodcastPlayer } from '@/hooks/usePodcastPlayer';
import { APP_VERSION } from '@/lib/version';

interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  route: string;
  hasSubmenu?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'all-albums',
    title: 'All Albums',
    icon: Disc,
    route: '/albums'
  },
  {
    id: 'the-doerfels',
    title: 'The Doerfels',
    icon: Folder,
    route: '/albums', // Will be handled by state in Albums page
    hasSubmenu: true
  },
  {
    id: 'producers-picks',
    title: 'Producers Picks',
    icon: Crown,
    route: '/albums', // Will be handled by state in Albums page
    hasSubmenu: true
  },
  {
    id: 'live-concerts',
    title: 'Live Concerts',
    icon: Music,
    route: '/albums', // Will be handled by state in Albums page
    hasSubmenu: true
  }
];

export function NavigationSidebar() {
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('all-albums');
  const [animationDelay, setAnimationDelay] = useState(0);
  const { currentPodcast } = usePodcastPlayer();

  // Fixed color scheme matching your design
  const themeColors = {
    primary: '#667eea',
    secondary: '#764ba2', 
    accent: '#f093fb'
  };

  // CSS custom properties style object
  const customProperties = {
    '--primary-color': themeColors.primary,
    '--secondary-color': themeColors.secondary,
    '--accent-color': themeColors.accent,
    '--primary-light': themeColors.primary,
    '--secondary-light': themeColors.secondary,
    '--gradient': `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary}, ${themeColors.accent})`
  } as React.CSSProperties;

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/albums' || path.startsWith('/albums/')) {
      setActiveItem('all-albums');
    } else if (path === '/') {
      setActiveItem('all-albums');
    } else {
      setActiveItem('all-albums');
    }
  }, [location]);

  // Handle navigation item click
  const handleNavItemClick = (item: NavigationItem) => {
    setActiveItem(item.id);
    
    // For folder items, we'll navigate to albums and let the Albums page handle the folder state
    // This maintains compatibility with the existing Albums page folder system
    if (item.id === 'all-albums' || item.hasSubmenu) {
      navigate('/albums');
    } else {
      navigate(item.route);
    }
    
    setOpenMobile(false); // Close mobile sidebar
  };

  // Handle close button
  const handleClose = () => {
    setOpenMobile(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="navigation-sidebar w-80 h-[600px] flex flex-col overflow-hidden relative rounded-[20px] border shadow-2xl"
      style={{
        background: 'rgba(17, 17, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...customProperties
      }}
    >
      {/* Top gradient line */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5 opacity-80"
        style={{
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)'
        }}
      />

      {/* Header */}
      <div 
        className="flex items-center justify-between px-6 pt-6 pb-5 border-b"
        style={{
          borderBottomColor: 'rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}
      >
        <h2 className="text-xl font-bold text-white" style={{ letterSpacing: '-0.5px' }}>
          Navigation
        </h2>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 flex flex-col gap-2">
        {/* Navigation Items */}
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavItemClick(item)}
              className={`nav-item nav-item-shimmer flex items-center p-4 rounded-xl transition-all duration-300 relative overflow-hidden border font-medium ${
                isActive ? 'border' : 'border border-transparent'
              }`}
              style={{
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))' 
                  : 'transparent',
                borderColor: isActive ? 'rgba(102, 126, 234, 0.5)' : 'transparent',
                boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                fontSize: '15px',
                opacity: 0,
                transform: 'translateX(-20px)',
                animation: `slideIn 0.3s ease forwards ${0.1 * (index + 1)}s`
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = isActive 
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))' 
                    : 'transparent';
                  e.currentTarget.style.borderColor = isActive ? 'rgba(102, 126, 234, 0.5)' : 'transparent';
                  e.currentTarget.style.color = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <div className="w-5 h-5 mr-4 flex items-center justify-center flex-shrink-0">
                <Icon size={20} />
              </div>
              <span className="flex-1 text-left line-height-1.4">
                {item.title}
              </span>
              {item.hasSubmenu && (
                <ChevronRight 
                  size={16} 
                  className="nav-arrow opacity-60 transition-all duration-200"
                  style={{
                    transform: 'rotate(0deg)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div 
        className="px-6 py-5 border-t"
        style={{
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}
      >
        <div 
          className="text-center text-xs"
          style={{ color: 'rgba(255, 255, 255, 0.4)' }}
        >
          Music App v{APP_VERSION}
        </div>
      </div>

      <style>{`
        .navigation-sidebar {
          --primary-color: ${themeColors.primary};
          --secondary-color: ${themeColors.secondary};
          --accent-color: ${themeColors.accent};
          --primary-light: ${themeColors.primary};
          --secondary-light: ${themeColors.secondary};
          --gradient: linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary}, ${themeColors.accent});
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .nav-item-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-item:hover.nav-item-shimmer::before {
          left: 100%;
        }

        .nav-item:hover .nav-arrow {
          opacity: 1;
          transform: rotate(90deg) translateX(2px);
        }

        @media (max-width: 768px) {
          .navigation-sidebar {
            width: 100%;
            max-width: 320px;
            height: 70vh;
          }
        }
      `}</style>
    </div>
  );
}