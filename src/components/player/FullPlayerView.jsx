/**
 * FullPlayerView Component
 * Full-screen player view with Soft Gold theme
 */
import { useState } from "react";
import {
  ChevronDown,
  X,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Play,
  Pause,
  Volume2,
  BarChart3,
} from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { formatTime } from "../../utils/formatters";
import { hapticLight, hapticMedium } from "../../utils/haptics";
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

  // Handle toggle with haptic
  const handleToggle = () => {
    hapticMedium();
    toggle();
  };

  // Speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div className="fixed inset-0 z-50 bg-cream-200 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cream-400/30">
        <button
          onClick={() => {
            hapticLight();
            toggleExpanded();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full 
                     bg-cream-300 hover:bg-cream-400 transition-colors touch-target
                     focus-visible:ring-2 focus-visible:ring-gold-700"
          aria-label="Thu nhỏ"
        >
          <ChevronDown className="w-6 h-6 text-cream-800" />
        </button>
        <h2 className="text-cream-900 font-semibold">Đang phát</h2>
        <button
          onClick={() => {
            hapticLight();
            closePlayer();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full
                     bg-cream-300 hover:bg-cream-400 transition-colors touch-target
                     focus-visible:ring-2 focus-visible:ring-gold-700"
          aria-label="Đóng"
        >
          <X className="w-6 h-6 text-cream-800" />
        </button>
      </div>

      {/* Thumbnail & Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-y-auto">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6 flex-shrink-0">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className={`w-full h-full rounded-2xl object-cover shadow-soft-3d-lg transition-all duration-300 ${
              isPlaying ? "glow-gold scale-[1.02]" : ""
            }`}
          />
          {(isLoading || isBuffering) && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-900/50 rounded-2xl">
              <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Playing animation indicator */}
          {isPlaying && !isLoading && !isBuffering && (
            <div className="absolute bottom-2 right-2 p-2 bg-cream-900/60 backdrop-blur-sm rounded-lg">
              <PlayingAnimation size="md" barCount={4} />
            </div>
          )}

          {/* Audio Visualizer Overlay */}
          {showVisualizer && isPlaying && !isLoading && !isBuffering && (
            <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl overflow-hidden bg-gradient-to-t from-cream-900/60 to-transparent">
              <AudioVisualizer enabled={showVisualizer} barCount={16} />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-cream-900 text-center mb-1 line-clamp-2">
          {currentTrack.title}
        </h3>
        <p className="text-cream-600 text-center mb-2">{currentTrack.author}</p>

        {/* Enhanced Time Display */}
        <div className="flex items-center justify-center gap-2 text-sm mb-3">
          <span className="text-gold-600 font-semibold">
            {formatTime(currentTime)}
          </span>
          <span className="text-cream-500">/</span>
          <span className="text-cream-600">{formatTime(duration)}</span>
          <span className="text-cream-500 text-xs">
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
        {error && (
          <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm mb-4 animate-shake">
            {error}
          </p>
        )}
      </div>

      {/* Controls */}
      <div
        className="px-6 pb-safe bg-cream-50 rounded-t-3xl shadow-soft-player pt-6"
        style={{
          paddingBottom: "max(2rem, env(safe-area-inset-bottom, 1rem))",
        }}
      >
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
          <div className="flex justify-between mt-2 text-sm text-cream-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6">
          {/* Previous */}
          <button
            onClick={() => {
              hapticLight();
              playPrevious();
            }}
            className="w-12 h-12 flex items-center justify-center rounded-full
                       bg-cream-200 hover:bg-cream-300 transition-colors touch-target
                       focus-visible:ring-2 focus-visible:ring-gold-700"
            aria-label="Bài trước"
          >
            <SkipBack className="w-6 h-6 text-cream-800 fill-cream-800" />
          </button>

          {/* Rewind 10s */}
          <button
            onClick={() => {
              hapticLight();
              seekBy(-10);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full
                       bg-cream-200 hover:bg-cream-300 transition-colors touch-target
                       focus-visible:ring-2 focus-visible:ring-gold-700"
            aria-label="Lùi 10 giây"
          >
            <Rewind className="w-5 h-5 text-cream-700" />
          </button>

          {/* Play/Pause - 3D Gold */}
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center 
                       btn-gold-3d touch-target ripple-container
                       ${isPlaying ? "animate-pulse-gold" : ""}`}
            aria-label={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1" />
            )}
          </button>

          {/* Forward 30s */}
          <button
            onClick={() => {
              hapticLight();
              seekBy(30);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full
                       bg-cream-200 hover:bg-cream-300 transition-colors touch-target
                       focus-visible:ring-2 focus-visible:ring-gold-700"
            aria-label="Tiến 30 giây"
          >
            <FastForward className="w-5 h-5 text-cream-700" />
          </button>

          {/* Next */}
          <button
            onClick={() => {
              hapticLight();
              playNext();
            }}
            className="w-12 h-12 flex items-center justify-center rounded-full
                       bg-cream-200 hover:bg-cream-300 transition-colors touch-target
                       focus-visible:ring-2 focus-visible:ring-gold-700"
            aria-label="Bài tiếp"
          >
            <SkipForward className="w-6 h-6 text-cream-800 fill-cream-800" />
          </button>
        </div>

        {/* Secondary controls - Row 1: Advanced controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShuffleButton size="sm" />
          <RepeatButton size="sm" />
          <AutoPlayButton size="sm" />

          {/* Speed */}
          <select
            value={playbackSpeed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="bg-cream-200 text-cream-800 text-sm px-3 py-2 rounded-lg 
                       border border-cream-400/50 touch-target
                       focus:ring-2 focus:ring-gold-400"
          >
            {speedOptions.map((speed) => (
              <option key={speed} value={speed} className="bg-cream-50">
                {speed}x
              </option>
            ))}
          </select>

          {/* Visualizer toggle */}
          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            className={`
              w-9 h-9 flex items-center justify-center rounded-full transition-all touch-target
              focus-visible:ring-2 focus-visible:ring-gold-700
              ${
                showVisualizer
                  ? "bg-gold-400 text-white shadow-soft-3d-sm"
                  : "bg-cream-200 text-cream-600 hover:bg-cream-300"
              }
            `}
            aria-label={showVisualizer ? "Ẩn visualizer" : "Hiện visualizer"}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary controls - Row 2: Volume slider */}
        <div className="flex items-center justify-center gap-3">
          <Volume2 className="w-5 h-5 text-cream-600 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-32 sm:w-40 h-2 bg-cream-300 rounded-lg appearance-none cursor-pointer
                       accent-gold-400"
            aria-label="Âm lượng"
          />
          <span className="text-xs text-cream-600 w-8">{volume}%</span>
        </div>
      </div>
    </div>
  );
}

export default FullPlayerView;
