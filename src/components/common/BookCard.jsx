/**
 * BookCard Component
 * Soft Gold theme book card with 3D play button and micro-interactions
 */
import { useRef } from "react";
import { Play } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { hapticLight, createRipple } from "../../utils/haptics";

function BookCard({ book, variant = "default", showPlayButton = true }) {
  const { loadTrack, currentTrack, isPlaying } = usePlayer();
  const playButtonRef = useRef(null);

  const isCurrentTrack = currentTrack?.videoId === book.videoId;

  const handlePlay = (e) => {
    e.stopPropagation();
    hapticLight();
    if (playButtonRef.current) {
      createRipple(e, playButtonRef.current);
    }
    loadTrack({
      videoId: book.videoId,
      title: book.title,
      author: book.author,
      thumbnail: book.thumbnail,
      duration: book.duration,
    });
  };

  // Compact variant for horizontal lists
  if (variant === "compact") {
    return (
      <div
        onClick={handlePlay}
        className={`
          group flex-shrink-0 w-32 cursor-pointer gpu-accelerated
          transition-all duration-200 hover-scale
          ${isCurrentTrack ? "ring-2 ring-gold-400 rounded-2xl" : ""}
        `}
      >
        {/* Thumbnail */}
        <div className="relative aspect-square mb-2">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-full h-full object-cover rounded-2xl shadow-soft-card transition-shadow duration-300 group-hover:shadow-soft-card-hover"
            loading="lazy"
          />

          {/* 3D Play button with ripple */}
          {showPlayButton && (
            <button
              ref={playButtonRef}
              onClick={handlePlay}
              className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center
                         btn-gold-3d opacity-0 group-hover:opacity-100 ripple-container
                         transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
              aria-label="Phát"
            >
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </button>
          )}

          {/* Playing indicator with bars animation */}
          {isCurrentTrack && isPlaying && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-gold-400 rounded-full shadow-soft-3d-sm animate-scale-in">
              <div className="playing-bars h-2.5">
                <span className="bar bg-white" />
                <span className="bar bg-white" />
                <span className="bar bg-white" />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="text-sm font-semibold text-cream-900 line-clamp-2 mb-0.5">
          {book.title}
        </h3>
        <p className="text-xs text-cream-600 truncate">{book.author}</p>
      </div>
    );
  }

  // Default variant - full card with lift effect
  return (
    <div
      onClick={handlePlay}
      className={`
        group bg-cream-50 rounded-2xl overflow-hidden cursor-pointer gpu-accelerated
        transition-all duration-300 card-lift btn-press
        border border-cream-400/30 hover:border-gold-400/50
        ${isCurrentTrack ? "ring-2 ring-gold-400 border-gold-400 glow-gold" : ""}
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream-900/30 to-transparent" />

        {/* 3D Play button with ripple - positioned at bottom right */}
        {showPlayButton && (
          <button
            ref={playButtonRef}
            onClick={handlePlay}
            className="absolute bottom-3 right-3 w-11 h-11 sm:w-12 sm:h-12 
                       flex items-center justify-center btn-gold-3d ripple-container
                       transform transition-all duration-200
                       opacity-90 group-hover:opacity-100 group-hover:scale-110"
            aria-label="Phát"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5" />
          </button>
        )}

        {/* Duration badge */}
        {book.duration && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-cream-900/80 text-white text-xs font-medium rounded animate-fade-in">
            {book.duration}
          </span>
        )}

        {/* Now playing indicator with bars animation */}
        {isCurrentTrack && isPlaying && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-gold-400 rounded-full shadow-soft-3d-sm animate-bounce-in">
            <div className="playing-bars h-3">
              <span className="bar bg-white" />
              <span className="bar bg-white" />
              <span className="bar bg-white" />
            </div>
            <span className="text-xs text-white font-medium">Đang phát</span>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-cream-900 line-clamp-2 mb-1 transition-colors group-hover:text-gold-700">
          {book.title}
        </h3>
        <p className="text-xs sm:text-sm text-cream-600 truncate">
          {book.author}
        </p>
        {book.views && (
          <p className="text-xs text-cream-500 mt-1">{book.views}</p>
        )}
      </div>
    </div>
  );
}

export default BookCard;
