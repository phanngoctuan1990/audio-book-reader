/**
 * SearchResultCard Component
 * Grid card layout for search results - Soft Gold theme with responsive design
 */
import { usePlayer } from "../../contexts/PlayerContext";
import { usePlaylist } from "../../contexts/PlaylistContext";
import { Play, Plus } from "lucide-react";

function SearchResultCard({ result }) {
  const { loadTrack, currentTrack, isPlaying } = usePlayer();
  const { showAddToPlaylistModal } = usePlaylist();

  const isCurrentTrack = currentTrack?.videoId === result.videoId;

  const handlePlay = (e) => {
    e.stopPropagation();
    loadTrack({
      videoId: result.videoId,
      title: result.title,
      author: result.author,
      thumbnail: result.thumbnail,
      duration: result.duration,
    });
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    showAddToPlaylistModal({
      videoId: result.videoId,
      title: result.title,
      author: result.author,
      thumbnail: result.thumbnail,
      duration: result.duration,
    });
  };

  return (
    <div
      onClick={handlePlay}
      className={`
        group relative bg-cream-50 rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-200 hover:shadow-soft-card-hover active:scale-[0.98]
        border border-cream-400/30 hover:border-gold-400/50
        focus-within:ring-2 focus-within:ring-gold-400
        ${isCurrentTrack ? "ring-2 ring-gold-400 border-gold-400" : ""}
      `}
    >
      {/* Thumbnail container */}
      <div className="relative aspect-video">
        <img
          src={result.thumbnail}
          alt={result.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay with controls - visible on hover/focus */}
        <div
          className="absolute inset-0 bg-cream-900/0 group-hover:bg-cream-900/40 
                        transition-all flex items-center justify-center gap-2 sm:gap-3 
                        opacity-0 group-hover:opacity-100"
        >
          {/* Play button - 3D gold style */}
          <button
            onClick={handlePlay}
            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center 
                       btn-gold-3d transform scale-90 group-hover:scale-100 transition-transform"
            aria-label="Phát"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5" />
          </button>

          {/* Add to playlist button */}
          <button
            onClick={handleAddToPlaylist}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
                       bg-cream-50/90 rounded-full shadow-soft-3d-sm
                       transform scale-90 group-hover:scale-100 transition-transform
                       hover:bg-cream-100"
            aria-label="Thêm vào playlist"
          >
            <Plus className="w-5 h-5 text-cream-800" />
          </button>
        </div>

        {/* Duration badge */}
        {result.duration && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-cream-900/80 text-white text-xs font-medium rounded">
            {result.duration}
          </span>
        )}

        {/* Now playing indicator */}
        {isCurrentTrack && isPlaying && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-gold-400 rounded-full shadow-soft-3d-sm">
            <div className="flex gap-0.5 h-3">
              <span className="w-0.5 bg-white rounded-full animate-pulse" />
              <span
                className="w-0.5 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-0.5 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-xs text-white font-medium">Đang phát</span>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-cream-900 line-clamp-2 mb-1">
          {result.title}
        </h3>
        <p className="text-xs sm:text-sm text-cream-600 truncate">
          {result.author}
        </p>
        {result.views && (
          <div className="flex items-center gap-2 mt-2 text-xs text-cream-500">
            <span>{result.views}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultCard;
