/**
 * ShuffleButton Component
 * Toggles shuffle mode for the queue
 */
import { usePlayer } from "../../contexts/PlayerContext";

function ShuffleButton({ size = "md" }) {
  const { isShuffled, toggleShuffle, queue } = usePlayer();

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

  // Disable if no queue or only one track
  const isDisabled = queue.length <= 1;

  return (
    <button
      onClick={toggleShuffle}
      disabled={isDisabled}
      className={`
        ${sizeClasses[size]} flex items-center justify-center
        rounded-full transition-all active:scale-95 touch-target relative
        ${
          isDisabled
            ? "opacity-30 cursor-not-allowed"
            : isShuffled
              ? "bg-primary/20 text-primary"
              : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
        }
      `}
      aria-label={isShuffled ? "Shuffle on" : "Shuffle off"}
      title={isShuffled ? "Shuffle: On" : "Shuffle: Off"}
    >
      <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
        <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
      </svg>

      {/* Active indicator dot */}
      {isShuffled && !isDisabled && (
        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}

export default ShuffleButton;
