/**
 * ProgressBar Component
 * Interactive progress bar with time tooltips and touch support
 */
import { useState, useRef, useCallback } from "react";
import { formatTime } from "../../utils/formatters";

function ProgressBar({
  currentTime,
  duration,
  onSeek,
  height = "h-2",
  showTooltip = true,
  showKnob = true,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const progressRef = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Calculate time from position
  const getTimeFromPosition = useCallback(
    (clientX) => {
      if (!progressRef.current) return 0;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      return percent * duration;
    },
    [duration],
  );

  // Handle mouse/touch move
  const handleMove = useCallback(
    (clientX) => {
      if (!progressRef.current || duration <= 0) return;

      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const time = percent * duration;

      setHoverTime(time);
      setHoverPosition(percent * 100);

      if (isDragging && onSeek) {
        onSeek(time);
      }
    },
    [duration, isDragging, onSeek],
  );

  // Mouse events
  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverTime(null);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    if (isDragging && hoverTime !== null && onSeek) {
      onSeek(hoverTime);
    }
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (isDragging && hoverTime !== null && onSeek) {
      onSeek(hoverTime);
    }
    setIsDragging(false);
    setHoverTime(null);
  };

  // Click handler
  const handleClick = (e) => {
    const time = getTimeFromPosition(e.clientX);
    if (onSeek) {
      onSeek(time);
    }
  };

  // Add document-level listeners for dragging
  const handleGlobalMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove],
  );

  const handleGlobalMouseUp = useCallback(() => {
    if (isDragging && hoverTime !== null && onSeek) {
      onSeek(hoverTime);
    }
    setIsDragging(false);
  }, [isDragging, hoverTime, onSeek]);

  return (
    <div className="progress-bar-wrapper relative">
      <div
        ref={progressRef}
        className={`progress-bar-container relative ${height} bg-white/20 rounded-full cursor-pointer touch-target`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-white/10 rounded-full" />

        {/* Played progress */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-primary rounded-full transition-all duration-75"
          style={{
            width: `${isDragging && hoverTime !== null ? hoverPosition : progress}%`,
          }}
        />

        {/* Hover indicator line */}
        {showTooltip && hoverTime !== null && !isDragging && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/50"
            style={{ left: `${hoverPosition}%` }}
          />
        )}

        {/* Draggable knob */}
        {showKnob && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${isDragging ? "scale-125" : ""}`}
            style={{
              left: `${isDragging && hoverTime !== null ? hoverPosition : progress}%`,
            }}
          />
        )}
      </div>

      {/* Time tooltip on hover */}
      {showTooltip && hoverTime !== null && (
        <div
          className="absolute -top-8 -translate-x-1/2 px-2 py-1 bg-dark-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10"
          style={{ left: `${hoverPosition}%` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
