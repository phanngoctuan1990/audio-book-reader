/**
 * AutoPlayButton Component
 * Toggles auto-play next track feature
 */
import { usePlayer } from "../../contexts/PlayerContext";

function AutoPlayButton({ size = "md" }) {
  const { autoPlayNext, toggleAutoPlay } = usePlayer();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={toggleAutoPlay}
      className={`
        ${sizeClasses[size]} flex items-center justify-center
        rounded-full transition-all active:scale-95 touch-target relative
        ${
          autoPlayNext
            ? "bg-primary/20 text-primary"
            : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
        }
      `}
      aria-label={autoPlayNext ? "Auto-play on" : "Auto-play off"}
      title={autoPlayNext ? "Auto-play: On" : "Auto-play: Off"}
    >
      <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
        {/* Auto-play / continuous play icon */}
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
      </svg>

      {/* Active indicator dot */}
      {autoPlayNext && (
        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}

export default AutoPlayButton;
