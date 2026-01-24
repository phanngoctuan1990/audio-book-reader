/**
 * RadioPlayer Component
 * Mini player for radio streaming with basic controls
 */
import { useRadio } from "../../contexts/RadioContext";

function RadioPlayer() {
  const {
    currentStation,
    isPlaying,
    isLoading,
    isBuffering,
    error,
    volume,
    toggleRadio,
    setVolume,
    stopRadio,
  } = useRadio();

  // Don't render if no station
  if (!currentStation) return null;

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2">
      <div className="glass rounded-2xl overflow-hidden shadow-lg">
        {/* Stream status indicator */}
        <div className="h-1 bg-white/10">
          {isBuffering ? (
            <div className="h-full bg-yellow-500/50 animate-pulse" />
          ) : isPlaying ? (
            <div className="h-full bg-gradient-to-r from-accent-purple to-primary w-full" />
          ) : (
            <div className="h-full bg-white/20 w-full" />
          )}
        </div>

        <div className="flex items-center gap-3 p-3">
          {/* Radio icon with animation */}
          <div className="relative flex-shrink-0">
            <div
              className={`
              w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-primary
              flex items-center justify-center
              ${isPlaying ? "animate-pulse-slow" : ""}
            `}
            >
              <span className="text-2xl">📻</span>
            </div>
            {(isLoading || isBuffering) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Station info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {currentStation.name}
            </h4>
            <p className="text-xs text-white/60 truncate">
              {currentStation.genre} • {isPlaying ? "Đang phát" : "Tạm dừng"}
            </p>
            {error && <p className="text-xs text-red-400 truncate">{error}</p>}
          </div>

          {/* Volume slider (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-white/60">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-3
                         [&::-webkit-slider-thumb]:h-3
                         [&::-webkit-slider-thumb]:bg-white
                         [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={toggleRadio}
            disabled={isLoading}
            className="w-11 h-11 flex items-center justify-center 
                       bg-gradient-to-r from-accent-purple to-primary rounded-full
                       active:scale-95 transition-transform touch-target
                       disabled:opacity-50"
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

          {/* Stop Button */}
          <button
            onClick={stopRadio}
            className="w-8 h-8 flex items-center justify-center 
                       text-white/60 hover:text-white
                       rounded-full hover:bg-white/10
                       transition-colors touch-target"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RadioPlayer;
