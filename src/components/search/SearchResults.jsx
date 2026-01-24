import { usePlayer } from "../../contexts/PlayerContext";
import { usePlaylist } from "../../contexts/PlaylistContext";
import { Plus, Play, Pause } from "lucide-react";
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
      <div className="mt-4 bg-cream-50 rounded-2xl p-6 text-center shadow-soft-card border border-cream-400/30">
        <span className="text-4xl mb-3 block">⚠️</span>
        <h3 className="text-cream-900 font-semibold mb-2">Có lỗi xảy ra</h3>
        <p className="text-cream-600 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 btn-gold-3d font-medium min-h-[44px]"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state (searched but no results)
  if (hasSearched && results.length === 0) {
    return (
      <div className="mt-4 bg-cream-50 rounded-2xl p-6 text-center shadow-soft-card border border-cream-400/30">
        <span className="text-4xl mb-3 block">🔍</span>
        <h3 className="text-cream-900 font-semibold mb-2">
          Không tìm thấy kết quả
        </h3>
        <p className="text-cream-600 text-sm">Thử tìm với từ khóa khác</p>
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
        <p className="text-cream-600 text-sm">Tìm thấy {resultCount} kết quả</p>
        {onViewModeChange && (
          <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        )}
      </div>

      {/* Grid View - Responsive columns with stagger animation */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((item, index) => (
            <div
              key={item.videoId}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
            >
              <SearchResultCard result={item} />
            </div>
          ))}
        </div>
      ) : (
        /* List View with stagger animation */
        <div className="space-y-2 sm:space-y-3">
          {results.map((item, index) => {
            const isCurrentlyPlaying = currentTrack?.videoId === item.videoId;

            return (
              <button
                key={item.videoId}
                onClick={() => handlePlay(item)}
                className={`
                  w-full flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl
                  text-left transition-all duration-200 animate-slide-up
                  active:scale-[0.98] hover:shadow-soft-card-hover card-lift
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700
                  ${
                    isCurrentlyPlaying
                      ? "bg-gold-100 border border-gold-400/50 glow-gold"
                      : "bg-cream-50 hover:bg-cream-100 border border-cream-400/30"
                  }
                `}
                style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-cream-200"
                    loading="lazy"
                  />
                  {/* Duration badge */}
                  {item.duration > 0 && (
                    <span className="absolute bottom-1 right-1 bg-cream-900/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(item.duration)}
                    </span>
                  )}
                  {/* Playing indicator */}
                  {isCurrentlyPlaying && (
                    <div className="absolute inset-0 bg-cream-900/40 rounded-xl flex items-center justify-center">
                      <div className="audio-wave flex gap-0.5 h-4">
                        <span className="w-1 bg-gold-400 rounded-full" />
                        <span className="w-1 bg-gold-400 rounded-full" />
                        <span className="w-1 bg-gold-400 rounded-full" />
                        <span className="w-1 bg-gold-400 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3
                    className={`font-semibold text-sm sm:text-base leading-snug line-clamp-2 ${isCurrentlyPlaying ? "text-gold-700" : "text-cream-900"}`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-cream-600 text-xs sm:text-sm mt-1 truncate">
                    {item.author}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-cream-500 mt-0.5">
                    <span>{formatDuration(item.duration)}</span>
                    <span>•</span>
                    <span>~{estimateFileSize(item.duration)}</span>
                    {item.views > 0 && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">
                          {formatViews(item.views)} lượt xem
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Play icon */}
                <div className="flex-shrink-0 self-center flex items-center gap-1 sm:gap-2">
                  {/* Add to playlist button */}
                  <button
                    onClick={(e) => handleAddToPlaylist(e, item)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                             text-cream-500 hover:text-gold-600 hover:bg-gold-100
                             transition-colors min-h-[44px] min-w-[44px]
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700"
                    title="Thêm vào playlist"
                    aria-label="Thêm vào playlist"
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  {/* Play button */}
                  <div
                    className={`
                  w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
                  ${
                    isCurrentlyPlaying
                      ? "bg-gold-400 text-white shadow-soft-3d-sm"
                      : "bg-cream-200 text-cream-600 hover:text-cream-800 hover:bg-cream-300"
                  }
                  transition-all
                `}
                  >
                    {isCurrentlyPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 fill-current" />
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
