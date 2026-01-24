/**
 * EnhancedMiniPlayer Component
 * Enhanced mini player with more info and interactive progress
 */
import { usePlayer } from "../../contexts/PlayerContext";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
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
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2">
      <div className="enhanced-mini-player glass rounded-2xl overflow-hidden shadow-lg">
        {/* Progress Bar at top */}
        <div className="px-3 pt-2">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            height="h-1"
            showTooltip={false}
            showKnob={false}
          />
        </div>

        {/* Main Content */}
        <div className="player-content p-3">
          <div className="flex items-center gap-3">
            {/* Thumbnail with status */}
            <div
              className="relative flex-shrink-0 cursor-pointer"
              onClick={toggleExpanded}
            >
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className={`w-14 h-14 rounded-xl object-cover ${isPlaying ? "glow-sm" : ""}`}
              />
              {/* Loading spinner */}
              {(isLoading || isBuffering) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {/* Playing animation */}
              {isPlaying && !isLoading && !isBuffering && (
                <div className="absolute bottom-1 right-1 p-1 bg-black/60 rounded">
                  <PlayingAnimation size="sm" barCount={3} />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={toggleExpanded}
            >
              <h4 className="text-sm font-medium text-white truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-white/60 truncate">
                {currentTrack.author}
              </p>
              {/* Time and Queue Info */}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-primary">
                  {formatTimeCompact(currentTime)}
                </span>
                <span className="text-xs text-white/40">/</span>
                <span className="text-xs text-white/40">
                  {formatTimeCompact(duration)}
                </span>
                {queue.length > 1 && (
                  <>
                    <span className="text-white/20">•</span>
                    <QueueInfo
                      queue={queue}
                      currentIndex={queueIndex}
                      compact={true}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-1">
              {/* Repeat indicator */}
              {repeatMode !== "none" && (
                <span className="text-primary text-xs">
                  {repeatMode === "one" ? "🔂" : "🔁"}
                </span>
              )}
              {/* Shuffle indicator */}
              {isShuffled && <span className="text-primary text-xs">🔀</span>}
            </div>

            {/* Next button (if queue) */}
            {queue.length > 1 && queueIndex < queue.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playNext();
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            )}

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              disabled={isLoading}
              className="w-12 h-12 flex items-center justify-center 
                         bg-gradient-primary rounded-full
                         active:scale-95 transition-transform touch-target"
            >
              {isPlaying ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
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
