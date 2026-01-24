/**
 * QueueInfo Component
 * Display queue information and next track preview
 * Soft Gold theme
 */
import { ListMusic } from "lucide-react";

function QueueInfo({ queue = [], currentIndex = 0, compact = false }) {
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

  return (
    <div className="queue-info p-3 bg-cream-100 rounded-xl border border-cream-400/30">
      {/* Queue Status */}
      <div className="queue-status flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-cream-600" />
          <span className="text-sm text-cream-700">
            Đang phát{" "}
            <span className="text-gold-600 font-semibold">
              {currentIndex + 1}
            </span>{" "}
            / {queue.length}
          </span>
        </div>
        {remainingTracks > 0 && (
          <span className="text-xs text-cream-600 bg-cream-200 px-2 py-1 rounded-full">
            {remainingTracks} bài tiếp theo
          </span>
        )}
      </div>

      {/* Next Track Preview */}
      {nextTrack && (
        <div className="next-track flex items-center gap-3 mt-3 p-2 bg-cream-50 rounded-lg border border-cream-400/20">
          <div className="flex-shrink-0">
            <span className="text-xs text-cream-500 uppercase tracking-wider font-medium">
              Tiếp theo
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img
              src={nextTrack.thumbnail}
              alt={nextTrack.title}
              className="w-8 h-8 rounded object-cover shadow-sm"
            />
            <div className="min-w-0">
              <p className="text-sm text-cream-800 truncate">
                {nextTrack.title}
              </p>
              <p className="text-xs text-cream-600 truncate">
                {nextTrack.author}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueueInfo;
