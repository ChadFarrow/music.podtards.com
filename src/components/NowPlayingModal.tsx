import { X } from 'lucide-react';

interface NowPlayingModalProps {
  isOpen: boolean;
  onClose: () => void;
  podcast?: {
    title: string;
    artist?: string;
    artwork?: string;
  };
}

export function NowPlayingModal({ isOpen, onClose, podcast }: NowPlayingModalProps) {
  if (!isOpen || !podcast) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Now Playing</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {podcast.artwork && (
          <img
            src={podcast.artwork}
            alt={podcast.title}
            className="w-full aspect-square object-cover rounded-lg mb-4"
          />
        )}
        
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">{podcast.title}</h3>
          {podcast.artist && (
            <p className="text-gray-400">{podcast.artist}</p>
          )}
        </div>
      </div>
    </div>
  );
}