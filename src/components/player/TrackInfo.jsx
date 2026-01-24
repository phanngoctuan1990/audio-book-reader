/**
 * TrackInfo Component
 * Detailed track information display with time and metadata
 */
import { formatTime } from "../../utils/formatters";
import PlayingAnimation from "./PlayingAnimation";

function TrackInfo({
  track,
  currentTime,
  duration,
  isPlaying = false,
  showMetadata = true,
  layout = "horizontal", // 'horizontal' or 'vertical'
}) {
  if (!track) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format view count
  const formatViews = (views) => {
    if (!views) return null;
    const num = parseInt(views);
    if (isNaN(num)) return views;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M lượt xem`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K lượt xem`;
    return `${num} lượt xem`;
  };

  if (layout === "vertical") {
    return (
      <div className="track-info-vertical text-center">
        {/* Thumbnail with glow effect */}
        <div className="relative inline-block mb-4">
          <img
            src={track.thumbnail}
            alt={track.title}
            className={`w-64 h-64 rounded-2xl object-cover shadow-2xl ${isPlaying ? "glow" : ""}`}
          />
          {/* Playing indicator overlay */}
          {isPlaying && (
            <div className="absolute bottom-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-lg">
              <PlayingAnimation size="md" barCount={4} />
            </div>
          )}
        </div>

        {/* Track Details */}
        <div className="track-details">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
            {track.title}
          </h3>
          <p className="text-white/60 mb-3">{track.author}</p>

          {/* Time Display */}
          <div className="time-display flex items-center justify-center gap-2 text-sm mb-2">
            <span className="text-primary font-medium">
              {formatTime(currentTime)}
            </span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">{formatTime(duration)}</span>
            <span className="text-white/40 text-xs">
              ({Math.round(progress)}%)
            </span>
          </div>

          {/* Additional Metadata */}
          {showMetadata && (track.views || track.uploadedDate) && (
            <div className="metadata flex items-center justify-center gap-3 text-xs text-white/40">
              {track.views && <span>{formatViews(track.views)}</span>}
              {track.views && track.uploadedDate && <span>•</span>}
              {track.uploadedDate && <span>{track.uploadedDate}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout (for mini player)
  return (
    <div className="track-info-horizontal flex items-center gap-3">
      {/* Thumbnail with glow effect */}
      <div className="thumbnail-container relative flex-shrink-0">
        <img
          src={track.thumbnail}
          alt={track.title}
          className={`w-12 h-12 rounded-lg object-cover ${isPlaying ? "glow-sm" : ""}`}
        />
        {/* Playing indicator overlay */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <PlayingAnimation size="sm" barCount={3} />
          </div>
        )}
      </div>

      {/* Track Details */}
      <div className="track-details flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">
          {track.title}
        </h4>
        <p className="text-xs text-white/60 truncate">{track.author}</p>
        {/* Time Display */}
        <div className="time-display flex items-center gap-1 text-xs text-white/40">
          <span className="text-primary">{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
          <span className="ml-1">({Math.round(progress)}%)</span>
        </div>
      </div>
    </div>
  );
}

export default TrackInfo;
