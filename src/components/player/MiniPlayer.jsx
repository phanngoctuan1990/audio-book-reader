/**
 * MiniPlayer Component
 * Compact player with Soft Gold theme, 3D effects, and micro-interactions
 */
import { useRef } from "react";
import { Play, Pause, SkipForward } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { formatTime } from "../../utils/formatters";
import { hapticLight, createRipple } from "../../utils/haptics";

function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    queue,
    queueIndex,
    toggle,
    playNext,
    toggleExpanded,
  } = usePlayer();

  const playButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Don't render if no track
  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasNext = queue.length > 1 && queueIndex < queue.length - 1;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    hapticLight();
    createRipple(e, playButtonRef.current);
    toggle();
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    hapticLight();
    createRipple(e, nextButtonRef.current);
    playNext();
  };

  return (
    <div className="fixed bottom-16 sm:bottom-20 lg:bottom-4 left-0 right-0 z-30 px-3 sm:px-4 lg:px-0 pb-2 animate-slide-up">
      <div
        className="bg-cream-50 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-soft-player 
                   border border-cream-400/30 sm:max-w-lg sm:mx-auto lg:max-w-xl lg:ml-72
                   cursor-pointer transition-all duration-200 hover:shadow-soft-card-hover
                   active:scale-[0.995] gpu-accelerated"
        onClick={toggleExpanded}
      >
        {/* Progress bar with smooth transition */}
        <div className="h-1 bg-cream-300 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-400 to-gold-500 progress-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-4">
          {/* Thumbnail with glow effect when playing */}
          <div className="relative flex-shrink-0">
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover transition-all duration-300 ${
                isPlaying ? "shadow-soft-3d glow-gold" : ""
              }`}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-cream-900/50 rounded-xl animate-fade-in">
                <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* Playing bars animation */}
            {isPlaying && !isLoading && (
              <div className="absolute bottom-1 right-1 p-0.5 bg-cream-900/60 rounded animate-scale-in">
                <div className="playing-bars h-2.5">
                  <span className="bar bg-gold-400" />
                  <span className="bar bg-gold-400" />
                  <span className="bar bg-gold-400" />
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-cream-900 truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-cream-600 truncate">
              {currentTrack.author}
            </p>
            <p className="text-xs text-cream-500 font-medium">
              <span className="text-gold-600">{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </p>
          </div>

          {/* Next Button (if queue) */}
          {hasNext && (
            <button
              ref={nextButtonRef}
              onClick={handleNextClick}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full
                         bg-cream-200 text-gold-600 hover:bg-cream-300 hover:text-gold-700
                         transition-all duration-200 min-h-[44px] min-w-[44px]
                         ripple-container btn-press
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700"
              aria-label="Bài tiếp theo"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}

          {/* Play/Pause Button - 3D Gold style with ripple */}
          <button
            ref={playButtonRef}
            onClick={handlePlayClick}
            className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center
                       btn-gold-3d min-h-[44px] min-w-[44px] ripple-container
                       transition-all duration-200 ${isPlaying ? "animate-pulse-gold" : ""}`}
            aria-label={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white transition-transform" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiniPlayer;
