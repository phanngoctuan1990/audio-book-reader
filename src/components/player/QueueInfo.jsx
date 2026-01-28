/**
 * QueueInfo Component
 * Display queue information and next track preview
 * Soft Gold theme
 */
import { useState } from "react";
import { ListMusic, ChevronDown, ChevronUp, X, Play } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";
import { hapticLight } from "../../utils/haptics";

function QueueInfo({ queue = [], currentIndex = 0, compact = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { removeFromQueue, loadTrack } = usePlayer();

  if (!queue.length) return null;

  const nextTrack = queue[currentIndex + 1];
  const remainingTracks = queue.length - currentIndex - 1;

  if (compact) {
    return (
      <div className="queue-info-compact flex items-center gap-2 text-xs text-cream-500">
        <span className="flex items-center gap-1">
          <ListMusic className="w-3 h-3" />
          {currentIndex + 1}/{queue.length}
        </span>
        {remainingTracks > 0 && <span>• {remainingTracks} tiếp theo</span>}
      </div>
    );
  }

  const handleRemove = (e, index) => {
    e.stopPropagation();
    hapticLight();
    removeFromQueue(index);
  };

  const handlePlayTrack = (track, index) => {
    hapticLight();
    loadTrack(track, 0); // Need to make sure loadTrack handles index if needed, or use setQueue
  };

  return (
    <div
      className={`queue-info p-3 bg-cream-100 rounded-2xl border border-cream-400/30 transition-all duration-300 overflow-hidden ${
        isExpanded ? "max-h-[300px]" : "max-h-[120px]"
      }`}
    >
      {/* Header / Status */}
      <div
        className="queue-status flex items-center justify-between cursor-pointer touch-target"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-gold-600" />
          <span className="text-sm font-medium text-cream-800">
            Hàng chờ ({queue.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {remainingTracks > 0 && !isExpanded && (
            <span className="text-[10px] text-gold-700 bg-gold-400/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              +{remainingTracks} bài
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-cream-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-cream-500" />
          )}
        </div>
      </div>

      {!isExpanded ? (
        /* Next Track Preview (Collapsed) */
        nextTrack && (
          <div className="next-track flex items-center gap-3 mt-3 p-2 bg-cream-50/50 rounded-xl border border-cream-400/10 active:bg-cream-200 transition-colors">
            <img
              src={nextTrack.thumbnail}
              alt={nextTrack.title}
              className="w-10 h-10 rounded-lg object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gold-600 font-bold uppercase tracking-widest mb-0.5">
                Tiếp theo
              </p>
              <p className="text-sm text-cream-900 truncate font-medium">
                {nextTrack.title}
              </p>
            </div>
          </div>
        )
      ) : (
        /* Full Scrollable Queue List (Expanded) */
        <div className="mt-3 overflow-y-auto max-h-[240px] pr-1 custom-scrollbar">
          <div className="flex flex-col gap-1.5">
            {queue.map((track, index) => {
              const isPlaying = index === currentIndex;
              return (
                <div
                  key={`${track.videoId}-${index}`}
                  className={`group flex items-center gap-3 p-2 rounded-xl transition-all ${
                    isPlaying
                      ? "bg-gold-50 border border-gold-200"
                      : "hover:bg-cream-200/50"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-gold-600/20 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-gold-700 fill-gold-700" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate font-medium ${
                        isPlaying ? "text-gold-900" : "text-cream-900"
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-xs text-cream-500 truncate">
                      {track.author}
                    </p>
                  </div>

                  {!isPlaying && (
                    <button
                      onClick={(e) => handleRemove(e, index)}
                      className="p-1.5 rounded-full hover:bg-cream-300 text-cream-400 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Xóa khỏi hàng chờ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default QueueInfo;
