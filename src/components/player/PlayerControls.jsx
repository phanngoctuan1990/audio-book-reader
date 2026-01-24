/**
 * PlayerControls Component
 * Combined primary and secondary player controls
 */
import { usePlayer } from "../../contexts/PlayerContext";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import AutoPlayButton from "./AutoPlayButton";

function PlayerControls({ showSecondary = true }) {
  const { isPlaying, isLoading, toggle, playNext, playPrevious, seekBy } =
    usePlayer();

  return (
    <div className="player-controls">
      {/* Primary Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {/* Previous */}
        <button
          onClick={playPrevious}
          className="w-12 h-12 flex items-center justify-center touch-target active:scale-95 transition-transform"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* Rewind 10s */}
        <button
          onClick={() => seekBy(-10)}
          className="w-10 h-10 flex items-center justify-center touch-target active:scale-95 transition-transform relative"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
          </svg>
          <span className="absolute -bottom-1 text-[10px] text-white/60 font-medium">
            10
          </span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={toggle}
          disabled={isLoading}
          className="w-16 h-16 flex items-center justify-center bg-gradient-primary rounded-full shadow-lg active:scale-95 transition-transform touch-target"
        >
          {isPlaying ? (
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Forward 30s */}
        <button
          onClick={() => seekBy(30)}
          className="w-10 h-10 flex items-center justify-center touch-target active:scale-95 transition-transform relative"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
          <span className="absolute -bottom-1 text-[10px] text-white/60 font-medium">
            30
          </span>
        </button>

        {/* Next */}
        <button
          onClick={playNext}
          className="w-12 h-12 flex items-center justify-center touch-target active:scale-95 transition-transform"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      {/* Secondary Controls */}
      {showSecondary && (
        <div className="flex items-center justify-center gap-4">
          <ShuffleButton size="md" />
          <RepeatButton size="md" />
          <AutoPlayButton size="md" />
        </div>
      )}
    </div>
  );
}

export default PlayerControls;
