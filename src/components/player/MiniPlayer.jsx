import { usePlayer } from '../../contexts/PlayerContext';
import { formatTime } from '../../utils/formatters';

function MiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading,
    currentTime, 
    duration,
    toggle, 
    toggleExpanded 
  } = usePlayer();

  // Don't render if no track
  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2">
      <div 
        className="glass rounded-2xl overflow-hidden shadow-lg cursor-pointer"
        onClick={toggleExpanded}
      >
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 p-3">
          {/* Thumbnail */}
          <div className="relative">
            <img 
              src={currentTrack.thumbnail} 
              alt={currentTrack.title}
              className={`w-12 h-12 rounded-lg object-cover ${isPlaying ? 'glow' : ''}`}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-white/60 truncate">
              {currentTrack.author}
            </p>
            <p className="text-xs text-white/40">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className="w-11 h-11 flex items-center justify-center 
                       bg-gradient-primary rounded-full
                       active:scale-95 transition-transform touch-target"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniPlayer;
