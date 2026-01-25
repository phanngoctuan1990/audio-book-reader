/**
 * EnhancedMiniPlayer Component
 * Enhanced mini player with responsive design and Soft Gold theme
 */
import { usePlayer } from "../../contexts/PlayerContext";
import { Play, Pause, SkipForward } from "lucide-react";
import ProgressBar from "./ProgressBar";
import QueueInfo from "./QueueInfo";
import PlayingAnimation from "./PlayingAnimation";

function EnhancedMiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    isBuffering,
    currentTime,
    duration,
    repeatMode,
    isShuffled,
    queue,
    queueIndex,
    toggle,
    seek,
    playNext,
    toggleExpanded,
  } = usePlayer();

  // Don't render if no track
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[72px] sm:bottom-24 lg:bottom-4 left-0 right-0 z-30 px-3 sm:px-4 lg:px-0 pb-safe">
      {/* Responsive container - centered on tablet/desktop */}
      <div
        className="enhanced-mini-player bg-cream-50 rounded-2xl overflow-hidden shadow-soft-player border border-cream-400/30
                      sm:max-w-lg sm:mx-auto lg:max-w-xl lg:ml-72"
      >
        {/* Progress Bar at top */}
        <div className="px-3 sm:px-4 pt-2">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            height="h-1"
            showTooltip={false}
            showKnob={false}
          />
        </div>

        {/* Main Content - responsive padding */}
        <div className="player-content p-3 sm:p-4">
          <div className="flex items-center gap-3">
            {/* Thumbnail with status */}
            <div
              className="relative flex-shrink-0 cursor-pointer"
              onClick={toggleExpanded}
            >
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover transition-shadow ${isPlaying ? "shadow-soft-3d" : ""}`}
              />
              {/* Loading spinner */}
              {(isLoading || isBuffering) && (
                <div className="absolute inset-0 flex items-center justify-center bg-cream-900/50 rounded-xl">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {/* Playing animation */}
              {isPlaying && !isLoading && !isBuffering && (
                <div className="absolute bottom-1 right-1 p-1 bg-cream-900/60 rounded">
                  <PlayingAnimation size="sm" barCount={3} />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={toggleExpanded}
            >
              <h4 className="text-sm font-semibold text-cream-900 truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-cream-600 truncate">
                {currentTrack.author}
              </p>
              {/* Time and Queue Info */}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gold-600 font-medium">
                  {formatTimeCompact(currentTime)}
                </span>
                <span className="text-xs text-cream-500">/</span>
                <span className="text-xs text-cream-500">
                  {formatTimeCompact(duration)}
                </span>
                {queue.length > 1 && (
                  <>
                    <span className="text-cream-400">•</span>
                    <QueueInfo
                      queue={queue}
                      currentIndex={queueIndex}
                      compact={true}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Status indicators - hidden on small screens */}
            <div className="hidden sm:flex items-center gap-1">
              {repeatMode !== "none" && (
                <span className="text-gold-600 text-xs">
                  {repeatMode === "one" ? "🔂" : "🔁"}
                </span>
              )}
              {isShuffled && <span className="text-gold-600 text-xs">🔀</span>}
            </div>

            {/* Next button (if queue) */}
            {queue.length > 1 && queueIndex < queue.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playNext();
                }}
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full 
                           bg-cream-200 text-cream-700 hover:bg-cream-300 hover:text-cream-900
                           transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700"
                aria-label="Bài tiếp theo"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}

            {/* Play/Pause Button - 3D gold style */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              disabled={isLoading}
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center 
                         btn-gold-3d min-h-[44px] min-w-[44px]"
              aria-label={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact time formatter without leading zeros for minutes
 */
function formatTimeCompact(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default EnhancedMiniPlayer;
