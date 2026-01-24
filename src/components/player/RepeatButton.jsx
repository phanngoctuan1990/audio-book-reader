/**
 * RepeatButton Component
 * Cycles through repeat modes: none → one → all → none
 * Soft Gold theme
 */
import { Repeat, Repeat1 } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { hapticLight } from "../../utils/haptics";

function RepeatButton({ size = "md" }) {
  const { repeatMode, cycleRepeatMode } = usePlayer();

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

  const isActive = repeatMode !== "none";

  const handleClick = () => {
    hapticLight();
    cycleRepeatMode();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]} flex items-center justify-center
        rounded-full transition-all active:scale-95 touch-target relative
        focus-visible:ring-2 focus-visible:ring-gold-700
        ${
          isActive
            ? "bg-gold-400/20 text-gold-600"
            : "bg-cream-200 text-cream-600 hover:text-cream-800 hover:bg-cream-300"
        }
      `}
      aria-label={`Repeat mode: ${repeatMode}`}
      title={`Repeat: ${repeatMode === "none" ? "Off" : repeatMode === "one" ? "One" : "All"}`}
    >
      {repeatMode === "one" ? (
        <Repeat1 className={iconSizes[size]} />
      ) : (
        <Repeat className={iconSizes[size]} />
      )}

      {/* Active indicator dot */}
      {isActive && (
        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gold-500" />
      )}
    </button>
  );
}

export default RepeatButton;
