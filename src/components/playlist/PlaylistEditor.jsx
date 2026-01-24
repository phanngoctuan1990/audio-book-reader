/**
 * PlaylistEditor Component
 * Edit playlist tracks with search, remove, and reorder
 */
import { useState, useEffect, useMemo } from "react";
import { usePlaylist } from "../../contexts/PlaylistContext";
import { usePlayer } from "../../contexts/PlayerContext";
import { formatDuration } from "../../utils/formatters";

function PlaylistEditor({ playlist, onBack }) {
  const { removeTrackFromPlaylist, clearAllTracks, reorderTracks } =
    usePlaylist();

  const { loadTrack, setQueue, currentTrack } = usePlayer();

  const [searchQuery, setSearchQuery] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  // Filter tracks based on search
  const filteredTracks = useMemo(() => {
    if (!playlist?.items || !searchQuery.trim()) {
      return playlist?.items || [];
    }

    const query = searchQuery.toLowerCase();
    return playlist.items.filter(
      (track) =>
        track.title?.toLowerCase().includes(query) ||
        track.author?.toLowerCase().includes(query),
    );
  }, [playlist?.items, searchQuery]);

  const handlePlayAll = () => {
    if (playlist?.items?.length > 0) {
      setQueue(
        playlist.items.map((item) => ({
          videoId: item.videoId,
          title: item.title,
          author: item.author,
          thumbnail: item.thumbnail,
          duration: item.duration,
        })),
        0,
      );
    }
  };

  const handlePlayTrack = (track, index) => {
    loadTrack({
      videoId: track.videoId,
      title: track.title,
      author: track.author,
      thumbnail: track.thumbnail,
      duration: track.duration,
    });
  };

  const handleRemoveTrack = async (e, videoId) => {
    e.stopPropagation();
    await removeTrackFromPlaylist(playlist.id, videoId);
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    await clearAllTracks(playlist.id);
    setIsClearing(false);
  };

  const handleMoveUp = async (e, index) => {
    e.stopPropagation();
    if (index > 0) {
      await reorderTracks(playlist.id, index, index - 1);
    }
  };

  const handleMoveDown = async (e, index) => {
    e.stopPropagation();
    if (index < playlist.items.length - 1) {
      await reorderTracks(playlist.id, index, index + 1);
    }
  };

  if (!playlist) return null;

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white truncate">
            {playlist.name}
          </h2>
          <p className="text-white/60 text-sm">
            {playlist.trackCount} bài •{" "}
            {formatDuration(playlist.totalDuration) || "0 phút"}
          </p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-2">
        {/* Play all button */}
        <button
          onClick={handlePlayAll}
          disabled={!playlist.items?.length}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-primary text-white rounded-xl font-medium disabled:opacity-50 active:scale-95 transition-transform"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Phát tất cả
        </button>

        {/* Clear all button */}
        <button
          onClick={handleClearAll}
          disabled={!playlist.items?.length || isClearing}
          className="px-4 py-3 text-white/60 hover:text-red-400 rounded-xl hover:bg-red-500/10 disabled:opacity-50 transition-colors"
        >
          {isClearing ? (
            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Search bar */}
      {playlist.items?.length > 3 && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm trong playlist..."
            className="w-full bg-dark-700 text-white placeholder-white/40 rounded-xl px-4 py-3 pl-10 text-sm border border-white/10 focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Track list */}
      {filteredTracks.length === 0 ? (
        <div className="bg-dark-800 rounded-2xl p-8 text-center">
          <span className="text-5xl mb-4 block">🎵</span>
          <h3 className="text-white font-semibold mb-2">
            {searchQuery ? "Không tìm thấy" : "Playlist trống"}
          </h3>
          <p className="text-white/60 text-sm">
            {searchQuery ? "Thử từ khóa khác" : "Thêm sách từ kết quả tìm kiếm"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTracks.map((track, index) => {
            const isPlaying = currentTrack?.videoId === track.videoId;
            const originalIndex = playlist.items.findIndex(
              (t) => t.videoId === track.videoId,
            );

            return (
              <div
                key={track.videoId}
                onClick={() => handlePlayTrack(track, index)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  transition-all active:scale-[0.98]
                  ${
                    isPlaying
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-dark-800 hover:bg-dark-700"
                  }
                `}
              >
                {/* Track number / playing indicator */}
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {isPlaying ? (
                    <div className="flex gap-0.5 h-4">
                      <span className="w-1 bg-primary rounded-full animate-pulse" />
                      <span
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  ) : (
                    <span className="text-white/40 text-sm">
                      {originalIndex + 1}
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-medium truncate ${isPlaying ? "text-primary" : "text-white"}`}
                  >
                    {track.title}
                  </h4>
                  <p className="text-white/60 text-xs truncate">
                    {track.author}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-white/40 text-xs flex-shrink-0">
                  {formatDuration(track.duration)}
                </span>

                {/* Reorder buttons */}
                {!searchQuery && (
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={(e) => handleMoveUp(e, originalIndex)}
                      disabled={originalIndex === 0}
                      className="p-1 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleMoveDown(e, originalIndex)}
                      disabled={originalIndex === playlist.items.length - 1}
                      className="p-1 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => handleRemoveTrack(e, track.videoId)}
                  className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PlaylistEditor;
