/**
 * PlayingAnimation Component
 * Animated playing indicator with bouncing bars
 */
function PlayingAnimation({ barCount = 4, size = "md" }) {
  const sizeClasses = {
    sm: "h-3 gap-0.5",
    md: "h-4 gap-0.5",
    lg: "h-5 gap-1",
  };

  const barWidths = {
    sm: "w-0.5",
    md: "w-1",
    lg: "w-1.5",
  };

  return (
    <div className={`playing-animation flex items-end ${sizeClasses[size]}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`${barWidths[size]} bg-gradient-to-t from-primary to-accent-blue rounded-sm`}
          style={{
            animation: "playingBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
            height: "25%",
          }}
        />
      ))}
    </div>
  );
}

export default PlayingAnimation;
