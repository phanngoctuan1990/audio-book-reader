/**
 * PlaylistManager Component
 * List and manage user playlists
 */
import { useState } from "react";
import { usePlaylist } from "../../contexts/PlaylistContext";
import { formatDuration } from "../../utils/formatters";

function PlaylistManager({ onSelectPlaylist }) {
  const { playlists, isLoading, createNewPlaylist, removePlaylist } =
    usePlaylist();

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    await createNewPlaylist(newPlaylistName.trim());
    setNewPlaylistName("");
    setIsCreating(false);
  };

  const handleDeletePlaylist = async (e, playlistId) => {
    e.stopPropagation();
    setDeletingId(playlistId);
    await removePlaylist(playlistId);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-xl bg-dark-800 animate-pulse"
          >
            <div className="w-16 h-16 rounded-lg bg-dark-700" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-dark-700 rounded w-3/4" />
              <div className="h-3 bg-dark-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Create new playlist */}
      {isCreating ? (
        <div className="p-4 bg-dark-800 rounded-xl">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Tên playlist mới..."
            className="w-full bg-dark-700 text-white placeholder-white/40 rounded-lg px-4 py-3 text-sm border border-white/10 focus:border-primary focus:outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreatePlaylist();
              if (e.key === "Escape") setIsCreating(false);
            }}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                setIsCreating(false);
                setNewPlaylistName("");
              }}
              className="flex-1 px-4 py-2 text-white/60 hover:text-white rounded-xl hover:bg-dark-700 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl disabled:opacity-50 transition-all active:scale-95"
            >
              Tạo playlist
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dashed border-white/20 hover:border-primary/50 transition-all active:scale-[0.98]"
        >
          <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
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
          </div>
          <div className="text-left">
            <h4 className="text-white font-medium">Tạo playlist mới</h4>
            <p className="text-white/60 text-sm">Thêm sách yêu thích của bạn</p>
          </div>
        </button>
      )}

      {/* Playlist list */}
      {playlists.length === 0 && !isCreating ? (
        <div className="bg-dark-800 rounded-2xl p-8 text-center">
          <span className="text-5xl mb-4 block">📚</span>
          <h3 className="text-white font-semibold mb-2">Chưa có playlist</h3>
          <p className="text-white/60 text-sm">
            Tạo playlist để lưu sách yêu thích của bạn
          </p>
        </div>
      ) : (
        playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onSelectPlaylist?.(playlist)}
            disabled={deletingId === playlist.id}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-dark-800 hover:bg-dark-700 transition-all active:scale-[0.98] disabled:opacity-50 text-left"
          >
            {/* Playlist thumbnail grid */}
            <div className="w-16 h-16 rounded-lg bg-dark-700 flex items-center justify-center overflow-hidden flex-shrink-0">
              {playlist.thumbnail ? (
                <img
                  src={playlist.thumbnail}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">🎵</span>
              )}
            </div>

            {/* Playlist info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">
                {playlist.name}
              </h4>
              <p className="text-white/60 text-sm">
                {playlist.trackCount} bài •{" "}
                {formatDuration(playlist.totalDuration) || "0 phút"}
              </p>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => handleDeletePlaylist(e, playlist.id)}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
            >
              {deletingId === playlist.id ? (
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
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
          </button>
        ))
      )}
    </div>
  );
}

export default PlaylistManager;
