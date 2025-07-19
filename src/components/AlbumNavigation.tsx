import { Menu, X } from 'lucide-react';

interface AlbumNavigationProps {
  onMenuToggle?: () => void;
  showMenu?: boolean;
}

export function AlbumNavigation({ onMenuToggle, showMenu }: AlbumNavigationProps) {
  return (
    <div 
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between py-2 backdrop-blur-lg transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent shadow-lg"
      style={{
        paddingTop: `max(0.5rem, env(safe-area-inset-top))`,
        paddingLeft: `max(1rem, env(safe-area-inset-left))`,
        paddingRight: `max(1rem, env(safe-area-inset-right))`
      }}
    >
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle}
          className="p-2 rounded-full backdrop-blur-sm transition-all bg-black/30 hover:bg-black/50 border border-white/20"
        >
          {showMenu ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Simplified navigation - no theme toggle or login for music site */}
      </div>
    </div>
  );
}
