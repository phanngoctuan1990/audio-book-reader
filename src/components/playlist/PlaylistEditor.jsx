/**
 * PlaylistEditor Component
 * Edit playlist tracks with search, remove, and reorder
 * Refactored for Soft Gold theme
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
    if (
      !window.confirm("Bạn có chắc muốn xóa tất cả bài hát khỏi playlist này?")
    )
      return;
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
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-cream-50 text-cream-600 hover:text-cream-950 rounded-full hover:bg-cream-200 transition-all shadow-soft-card border border-cream-400/30 active:scale-90"
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
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-cream-900 truncate">
            {playlist.name}
          </h2>
          <p className="text-cream-600 text-xs font-bold uppercase tracking-widest">
            {playlist.trackCount} bài •{" "}
            {formatDuration(playlist.totalDuration) || "0 phút"}
          </p>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-3">
        {/* Play all button */}
        <button
          onClick={handlePlayAll}
          disabled={!playlist.items?.length}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gold-400 text-white rounded-2xl font-bold shadow-soft-3d hover:bg-gold-500 disabled:opacity-50 active:scale-95 transition-all text-sm"
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
          className="w-12 h-12 flex items-center justify-center bg-cream-50 text-cream-500 hover:text-red-500 rounded-2xl hover:bg-red-50 border border-cream-300 shadow-soft-card disabled:opacity-50 transition-all active:scale-95"
          title="Xóa tất cả"
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
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm trong playlist..."
            className="w-full bg-cream-50 text-cream-950 placeholder-cream-400 rounded-2xl px-4 py-3.5 pl-12 text-sm border border-cream-300 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-400/10 shadow-soft-card font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-cream-200 text-cream-600 rounded-full hover:text-cream-950"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Track list */}
      {filteredTracks.length === 0 ? (
        <div className="bg-cream-50 rounded-3xl p-12 text-center border border-cream-300 shadow-soft-card">
          <span className="text-5xl mb-4 block opacity-30">🎵</span>
          <h3 className="text-cream-900 font-bold mb-2">
            {searchQuery ? "Không tìm thấy" : "Playlist trống"}
          </h3>
          <p className="text-cream-600 text-sm">
            {searchQuery ? "Thử từ khóa khác" : "Thêm sách từ kết quả tìm kiếm"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
                  flex items-center gap-4 p-3 rounded-2xl cursor-pointer
                  transition-all active:scale-[0.98] border
                  ${
                    isPlaying
                      ? "bg-gold-50 border-gold-400 shadow-soft-3d-sm"
                      : "bg-cream-50 border-cream-200 hover:bg-cream-100/50 shadow-soft-card"
                  }
                `}
              >
                {/* Track number / playing indicator */}
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {isPlaying ? (
                    <div className="flex gap-0.5 h-4">
                      <span className="w-1 bg-gold-500 rounded-full animate-bar-1" />
                      <span className="w-1 bg-gold-500 rounded-full animate-bar-2" />
                      <span className="w-1 bg-gold-500 rounded-full animate-bar-3" />
                    </div>
                  ) : (
                    <span className="text-cream-400 text-xs font-bold">
                      {(originalIndex + 1).toString().padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-soft-3d-inset"
                />

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-bold truncate ${isPlaying ? "text-gold-700" : "text-cream-900"}`}
                  >
                    {track.title}
                  </h4>
                  <p className="text-cream-600 text-xs truncate font-medium">
                    {track.author}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-cream-400 text-[10px] font-bold flex-shrink-0 bg-cream-100 px-2 py-1 rounded-md">
                  {formatDuration(track.duration)}
                </span>

                {/* Reorder buttons */}
                {!searchQuery && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => handleMoveUp(e, originalIndex)}
                      disabled={originalIndex === 0}
                      className="p-1 text-cream-400 hover:text-gold-600 disabled:opacity-20 transition-colors"
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
                          strokeWidth={2.5}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleMoveDown(e, originalIndex)}
                      disabled={originalIndex === playlist.items.length - 1}
                      className="p-1 text-cream-400 hover:text-gold-600 disabled:opacity-20 transition-colors"
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
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => handleRemoveTrack(e, track.videoId)}
                  className="w-10 h-10 flex items-center justify-center bg-cream-100/50 text-cream-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
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
