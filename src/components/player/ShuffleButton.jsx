/**
 * ShuffleButton Component
 * Toggles shuffle mode for the queue
 * Soft Gold theme
 */
import { Shuffle } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { hapticLight } from "../../utils/haptics";

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

  const handleClick = () => {
    hapticLight();
    toggleShuffle();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        ${sizeClasses[size]} flex items-center justify-center
        rounded-full transition-all active:scale-95 touch-target relative
        focus-visible:ring-2 focus-visible:ring-gold-700
        ${
          isDisabled
            ? "opacity-30 cursor-not-allowed bg-cream-200 text-cream-500"
            : isShuffled
              ? "bg-gold-400/20 text-gold-600"
              : "bg-cream-200 text-cream-600 hover:text-cream-800 hover:bg-cream-300"
        }
      `}
      aria-label={isShuffled ? "Shuffle on" : "Shuffle off"}
      title={isShuffled ? "Shuffle: On" : "Shuffle: Off"}
    >
      <Shuffle className={iconSizes[size]} />

      {/* Active indicator dot */}
      {isShuffled && !isDisabled && (
        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gold-500" />
      )}
    </button>
  );
}

export default ShuffleButton;
