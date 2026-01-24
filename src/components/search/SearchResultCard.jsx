/**
 * SearchResultCard Component
 * Grid card layout for search results (Music-CLI style)
 */
import { usePlayer } from "../../contexts/PlayerContext";
import { usePlaylist } from "../../contexts/PlaylistContext";

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
        group relative bg-dark-800 rounded-xl overflow-hidden cursor-pointer
        transition-all hover:bg-dark-700 active:scale-[0.98]
        ${isCurrentTrack ? "ring-2 ring-primary" : ""}
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

        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          {/* Play button */}
          <button
            onClick={handlePlay}
            className="w-12 h-12 flex items-center justify-center bg-primary rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
          >
            <svg
              className="w-6 h-6 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {/* Add to playlist button */}
          <button
            onClick={handleAddToPlaylist}
            className="w-10 h-10 flex items-center justify-center bg-dark-800/80 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
          >
            <svg
              className="w-5 h-5 text-white"
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
        </div>

        {/* Duration badge */}
        {result.duration && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs font-medium rounded">
            {result.duration}
          </span>
        )}

        {/* Now playing indicator */}
        {isCurrentTrack && isPlaying && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-primary rounded-full">
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
      <div className="p-3">
        <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">
          {result.title}
        </h3>
        <p className="text-xs text-white/60 truncate">{result.author}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
          {result.views && <span>{result.views}</span>}
        </div>
      </div>
    </div>
  );
}

export default SearchResultCard;
