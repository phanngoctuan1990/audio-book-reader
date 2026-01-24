/**
 * QueueInfo Component
 * Display queue information and next track preview
 */
function QueueInfo({ queue = [], currentIndex = 0, compact = false }) {
  if (!queue.length) return null;

  const nextTrack = queue[currentIndex + 1];
  const remainingTracks = queue.length - currentIndex - 1;

  if (compact) {
    return (
      <div className="queue-info-compact flex items-center gap-2 text-xs text-white/40">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
          </svg>
          {currentIndex + 1}/{queue.length}
        </span>
        {remainingTracks > 0 && <span>• {remainingTracks} tiếp theo</span>}
      </div>
    );
  }

  return (
    <div className="queue-info p-3 bg-white/5 rounded-xl">
      {/* Queue Status */}
      <div className="queue-status flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-white/60"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
          </svg>
          <span className="text-sm text-white/80">
            Đang phát{" "}
            <span className="text-primary font-medium">{currentIndex + 1}</span>{" "}
            / {queue.length}
          </span>
        </div>
        {remainingTracks > 0 && (
          <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
            {remainingTracks} bài tiếp theo
          </span>
        )}
      </div>

      {/* Next Track Preview */}
      {nextTrack && (
        <div className="next-track flex items-center gap-3 mt-3 p-2 bg-white/5 rounded-lg">
          <div className="flex-shrink-0">
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Tiếp theo
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img
              src={nextTrack.thumbnail}
              alt={nextTrack.title}
              className="w-8 h-8 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{nextTrack.title}</p>
              <p className="text-xs text-white/50 truncate">
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
