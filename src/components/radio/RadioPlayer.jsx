/**
 * RadioPlayer Component
 * Mini player for radio streaming with basic controls
 * Refactored for Soft Gold theme and clear readability
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
    <div className="fixed bottom-[72px] sm:bottom-24 left-0 right-0 z-30 px-3 pb-safe">
      <div className="bg-cream-50/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-soft-player border border-gold-200/50 sm:max-w-lg sm:mx-auto lg:max-w-xl lg:ml-72">
        {/* Stream status indicator */}
        <div className="h-1 bg-cream-200">
          {isBuffering ? (
            <div className="h-full bg-gold-400/50 animate-pulse" />
          ) : isPlaying ? (
            <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 w-full" />
          ) : (
            <div className="h-full bg-cream-300 w-full" />
          )}
        </div>

        <div className="flex items-center gap-3 p-3">
          {/* Radio icon with animation */}
          <div className="relative flex-shrink-0">
            <div
              className={`
              w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600
              flex items-center justify-center shadow-soft-3d-sm
              ${isPlaying ? "animate-pulse" : ""}
            `}
            >
              <span className="text-2xl">📻</span>
            </div>
            {(isLoading || isBuffering) && (
              <div className="absolute inset-0 flex items-center justify-center bg-cream-900/40 rounded-xl">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Station info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-cream-900 truncate">
              {currentStation.name}
            </h4>
            <p className="text-xs text-cream-600 truncate">
              {currentStation.genre} • {isPlaying ? "Đang phát" : "Tạm dừng"}
            </p>
            {error && (
              <p className="text-xs text-red-500 font-medium truncate mt-0.5">
                {error}
              </p>
            )}
          </div>

          {/* Volume slider (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-cream-500 text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-cream-300 rounded-full appearance-none cursor-pointer accent-gold-600"
            />
          </div>

          {/* Play/Pause Button - Gold style */}
          <button
            onClick={toggleRadio}
            disabled={isLoading}
            className="w-12 h-12 flex items-center justify-center 
                       btn-gold-3d min-h-[44px] min-w-[44px]
                       disabled:opacity-50"
            aria-label={isPlaying ? "Tạm dừng" : "Phát"}
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
            className="w-10 h-10 flex items-center justify-center 
                       text-cream-500 hover:text-red-500
                       rounded-full hover:bg-cream-200
                       transition-colors transition-transform active:scale-95"
            aria-label="Dừng Radio"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RadioPlayer;
