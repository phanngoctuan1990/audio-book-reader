/**
 * RepeatButton Component
 * Cycles through repeat modes: none → one → all → none
 */
import { usePlayer } from "../../contexts/PlayerContext";

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

  return (
    <button
      onClick={cycleRepeatMode}
      className={`
        ${sizeClasses[size]} flex items-center justify-center
        rounded-full transition-all active:scale-95 touch-target relative
        ${
          isActive
            ? "bg-primary/20 text-primary"
            : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
        }
      `}
      aria-label={`Repeat mode: ${repeatMode}`}
      title={`Repeat: ${repeatMode === "none" ? "Off" : repeatMode === "one" ? "One" : "All"}`}
    >
      <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
        {repeatMode === "one" ? (
          // Repeat one icon
          <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
        ) : (
          // Repeat all icon
          <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
        )}
      </svg>

      {/* Active indicator dot */}
      {isActive && (
        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}

export default RepeatButton;
