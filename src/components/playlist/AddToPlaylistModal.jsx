/**
 * AddToPlaylistModal Component
 * Modal for adding tracks to playlists
 */
import { useState } from "react";
import { usePlaylist } from "../../contexts/PlaylistContext";

function AddToPlaylistModal() {
  const {
    showAddModal,
    trackToAdd,
    playlists,
    hideAddToPlaylistModal,
    createNewPlaylist,
    addTrackToPlaylist,
  } = usePlaylist();

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [addingToId, setAddingToId] = useState(null);

  if (!showAddModal || !trackToAdd) return null;

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    const playlist = await createNewPlaylist(newPlaylistName.trim());
    if (playlist) {
      await addTrackToPlaylist(playlist.id, trackToAdd);
      setNewPlaylistName("");
      setIsCreating(false);
      hideAddToPlaylistModal();
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    setAddingToId(playlistId);
    const success = await addTrackToPlaylist(playlistId, trackToAdd);
    setAddingToId(null);

    if (success) {
      hideAddToPlaylistModal();
    }
  };

  const handleClose = () => {
    setIsCreating(false);
    setNewPlaylistName("");
    hideAddToPlaylistModal();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 animate-in fade-in">
      <div className="bg-dark-800 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Thêm vào Playlist</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
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

        {/* Track info */}
        <div className="flex items-center gap-3 p-4 bg-dark-700/50">
          <img
            src={trackToAdd.thumbnail}
            alt={trackToAdd.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {trackToAdd.title}
            </h4>
            <p className="text-xs text-white/60 truncate">
              {trackToAdd.author}
            </p>
          </div>
        </div>

        {/* Playlist list */}
        <div className="overflow-y-auto max-h-[40vh] p-2">
          {/* Create new playlist */}
          {isCreating ? (
            <div className="p-3 bg-dark-700 rounded-xl mb-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Tên playlist mới..."
                className="w-full bg-dark-600 text-white placeholder-white/40 rounded-lg px-3 py-2 text-sm border border-white/10 focus:border-primary focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  Tạo & Thêm
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-dark-700 transition-colors mb-2"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
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
              <span className="text-white font-medium">Tạo playlist mới</span>
            </button>
          )}

          {/* Existing playlists */}
          {playlists.length === 0 && !isCreating && (
            <div className="text-center py-8 text-white/60">
              <p>Chưa có playlist nào</p>
              <p className="text-sm mt-1">Tạo playlist đầu tiên của bạn!</p>
            </div>
          )}

          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handleAddToPlaylist(playlist.id)}
              disabled={addingToId === playlist.id}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-dark-700 transition-colors disabled:opacity-50"
            >
              {/* Playlist thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-dark-600 flex items-center justify-center overflow-hidden">
                {playlist.thumbnail ? (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🎵</span>
                )}
              </div>

              {/* Playlist info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {playlist.name}
                </h4>
                <p className="text-xs text-white/60">
                  {playlist.trackCount} bài hát
                </p>
              </div>

              {/* Loading indicator */}
              {addingToId === playlist.id && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>

        {/* Bottom padding for mobile */}
        <div className="h-safe" />
      </div>
    </div>
  );
}

export default AddToPlaylistModal;
