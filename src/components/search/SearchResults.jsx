import { usePlayer } from "../../contexts/PlayerContext";
import { usePlaylist } from "../../contexts/PlaylistContext";
import { formatDuration } from "../../utils/formatters";
import LoadingSkeleton from "../common/LoadingSkeleton";
import SearchResultCard from "./SearchResultCard";
import ViewModeToggle from "./ViewModeToggle";

/**
 * Estimate file size based on duration
 * Average: ~15MB per hour for audio
 */
function estimateFileSize(duration) {
  if (!duration || duration === 0) return "~0 MB";

  const durationInSeconds =
    typeof duration === "string" ? parseDuration(duration) : duration;

  const hours = durationInSeconds / 3600;
  const sizeMB = Math.round(hours * 15); // 15MB per hour

  if (sizeMB < 1) return "<1 MB";
  if (sizeMB >= 1000) return `${(sizeMB / 1000).toFixed(1)} GB`;
  return `${sizeMB} MB`;
}

/**
 * Parse duration string to seconds
 */
function parseDuration(duration) {
  if (typeof duration === "number") return duration;
  if (!duration) return 0;

  // Remove any non-numeric characters except : and digits
  const cleaned = String(duration).trim();

  // Try to parse as "HH:MM:SS" or "MM:SS"
  const parts = cleaned
    .split(":")
    .map((p) => parseInt(p, 10))
    .filter((n) => !isNaN(n));

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }

  return 0;
}

/**
 * SearchResults component displaying list/grid of audiobooks
 */
function SearchResults({
  results,
  isLoading,
  error,
  hasSearched,
  onRetry,
  viewMode = "grid",
  onViewModeChange,
}) {
  const { loadTrack, currentTrack } = usePlayer();
  const { showAddToPlaylistModal } = usePlaylist();

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-4">
        <LoadingSkeleton type="card" count={5} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-4 bg-dark-800 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-3 block">⚠️</span>
        <h3 className="text-white font-semibold mb-2">Có lỗi xảy ra</h3>
        <p className="text-white/60 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-primary text-white rounded-xl 
                     font-medium active:scale-95 transition-transform"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state (searched but no results)
  if (hasSearched && results.length === 0) {
    return (
      <div className="mt-4 bg-dark-800 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-3 block">🔍</span>
        <h3 className="text-white font-semibold mb-2">
          Không tìm thấy kết quả
        </h3>
        <p className="text-white/60 text-sm">Thử tìm với từ khóa khác</p>
      </div>
    );
  }

  // No search yet
  if (!hasSearched) {
    return null;
  }

  // Results count
  const resultCount = results.length;

  const handlePlay = (item) => {
    loadTrack({
      videoId: item.videoId,
      title: item.title,
      author: item.author,
      thumbnail: item.thumbnail,
      duration: item.duration,
    });
  };

  const handleAddToPlaylist = (e, item) => {
    e.stopPropagation();
    showAddToPlaylistModal({
      videoId: item.videoId,
      title: item.title,
      author: item.author,
      thumbnail: item.thumbnail,
      duration: item.duration,
    });
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Header with results count and view toggle */}
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">Tìm thấy {resultCount} kết quả</p>
        {onViewModeChange && (
          <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        )}
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((item) => (
            <SearchResultCard key={item.videoId} result={item} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {results.map((item) => {
            const isCurrentlyPlaying = currentTrack?.videoId === item.videoId;

            return (
              <button
                key={item.videoId}
                onClick={() => handlePlay(item)}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-xl
                  text-left transition-all duration-200
                  active:scale-[0.98]
                  ${
                    isCurrentlyPlaying
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-dark-800 hover:bg-dark-700 border border-transparent"
                  }
                `}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover bg-dark-700"
                    loading="lazy"
                  />
                  {/* Duration badge */}
                  {item.duration > 0 && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(item.duration)}
                    </span>
                  )}
                  {/* Playing indicator */}
                  {isCurrentlyPlaying && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                      <div className="audio-wave flex gap-0.5 h-4">
                        <span className="w-1 bg-primary rounded-full" />
                        <span className="w-1 bg-primary rounded-full" />
                        <span className="w-1 bg-primary rounded-full" />
                        <span className="w-1 bg-primary rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3
                    className={`font-medium text-sm leading-snug line-clamp-2 ${isCurrentlyPlaying ? "text-primary" : "text-white"}`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 truncate">
                    {item.author}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                    <span>{formatDuration(item.duration)}</span>
                    <span>•</span>
                    <span>~{estimateFileSize(item.duration)}</span>
                    {item.views > 0 && (
                      <>
                        <span>•</span>
                        <span>{formatViews(item.views)} lượt xem</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Play icon */}
                <div className="flex-shrink-0 self-center flex items-center gap-1">
                  {/* Add to playlist button */}
                  <button
                    onClick={(e) => handleAddToPlaylist(e, item)}
                    className="w-9 h-9 rounded-full flex items-center justify-center
                             text-white/40 hover:text-primary hover:bg-primary/10
                             transition-colors"
                    title="Thêm vào playlist"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>

                  {/* Play button */}
                  <div
                    className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    isCurrentlyPlaying
                      ? "bg-primary text-white"
                      : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                  }
                  transition-colors
                `}
                  >
                    {isCurrentlyPlaying ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Format view count to human readable
 */
function formatViews(views) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

export default SearchResults;
