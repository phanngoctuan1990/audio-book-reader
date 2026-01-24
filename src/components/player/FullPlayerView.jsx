/**
 * FullPlayerView Component
 * Full-screen player view with custom controls
 */
import { useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import { formatTime } from "../../utils/formatters";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import AutoPlayButton from "./AutoPlayButton";
import AudioVisualizer from "./AudioVisualizer";
import ProgressBar from "./ProgressBar";
import PlayingAnimation from "./PlayingAnimation";
import QueueInfo from "./QueueInfo";

function FullPlayerView() {
  const [showVisualizer, setShowVisualizer] = useState(true);

  const {
    currentTrack,
    isPlaying,
    isLoading,
    isBuffering,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    error,
    queue,
    queueIndex,
    toggle,
    seek,
    seekBy,
    setVolume,
    setSpeed,
    playNext,
    playPrevious,
    toggleExpanded,
    closePlayer,
  } = usePlayer();

  // Don't render if no track
  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  // Speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div className="fixed inset-0 z-50 bg-dark-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={toggleExpanded}
          className="w-10 h-10 flex items-center justify-center touch-target"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <h2 className="text-white font-medium">Now Playing</h2>
        <button
          onClick={closePlayer}
          className="w-10 h-10 flex items-center justify-center touch-target"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Thumbnail & Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-y-auto">
        <div className="relative w-64 h-64 mb-6 flex-shrink-0">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className={`w-full h-full rounded-2xl object-cover shadow-2xl ${isPlaying ? "glow" : ""}`}
          />
          {(isLoading || isBuffering) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Playing animation indicator */}
          {isPlaying && !isLoading && !isBuffering && (
            <div className="absolute bottom-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-lg">
              <PlayingAnimation size="md" barCount={4} />
            </div>
          )}

          {/* Audio Visualizer Overlay */}
          {showVisualizer && isPlaying && !isLoading && !isBuffering && (
            <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl overflow-hidden bg-gradient-to-t from-black/60 to-transparent">
              <AudioVisualizer enabled={showVisualizer} barCount={16} />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-white text-center mb-1 line-clamp-2">
          {currentTrack.title}
        </h3>
        <p className="text-white/60 text-center mb-2">{currentTrack.author}</p>

        {/* Enhanced Time Display */}
        <div className="flex items-center justify-center gap-2 text-sm mb-3">
          <span className="text-primary font-medium">
            {formatTime(currentTime)}
          </span>
          <span className="text-white/40">/</span>
          <span className="text-white/60">{formatTime(duration)}</span>
          <span className="text-white/40 text-xs">
            ({Math.round(progress)}%)
          </span>
        </div>

        {/* Queue Info */}
        {queue.length > 1 && (
          <div className="w-full max-w-xs mb-4">
            <QueueInfo queue={queue} currentIndex={queueIndex} />
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      </div>

      {/* Controls */}
      <div className="px-6 pb-8">
        {/* Enhanced Progress bar */}
        <div className="mb-4">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            height="h-2"
            showTooltip={true}
            showKnob={true}
          />
          <div className="flex justify-between mt-2 text-sm text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Previous */}
          <button
            onClick={playPrevious}
            className="w-12 h-12 flex items-center justify-center touch-target"
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
            className="w-10 h-10 flex items-center justify-center touch-target"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
            </svg>
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
            className="w-10 h-10 flex items-center justify-center touch-target"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className="w-12 h-12 flex items-center justify-center touch-target"
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

        {/* Secondary controls */}
        <div className="flex items-center justify-between px-4">
          {/* Advanced controls - left side */}
          <div className="flex items-center gap-2">
            <ShuffleButton size="sm" />
            <RepeatButton size="sm" />
            <AutoPlayButton size="sm" />
          </div>

          {/* Speed */}
          <select
            value={playbackSpeed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="bg-white/10 text-white text-sm px-3 py-2 rounded-lg touch-target"
          >
            {speedOptions.map((speed) => (
              <option key={speed} value={speed} className="bg-dark-800">
                {speed}x
              </option>
            ))}
          </select>

          {/* Visualizer toggle & Volume */}
          <div className="flex items-center gap-2">
            {/* Visualizer toggle */}
            <button
              onClick={() => setShowVisualizer(!showVisualizer)}
              className={`
                w-8 h-8 flex items-center justify-center rounded-full transition-all
                ${
                  showVisualizer
                    ? "bg-primary/20 text-primary"
                    : "bg-white/10 text-white/60"
                }
              `}
              title={showVisualizer ? "Hide visualizer" : "Show visualizer"}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17V7h2v10H3zm4-4v-2h2v2H7zm4 4V7h2v10h-2zm4-8v2h2V9h-2zm0 4v4h2v-4h-2zm4-6v10h2V7h-2z" />
              </svg>
            </button>

            {/* Volume */}
            <svg
              className="w-5 h-5 text-white/60"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullPlayerView;
