/**
 * AddToPlaylistModal Component
 * Modal for adding tracks to playlists
 * Refactored for Soft Gold theme
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-[100] animate-in fade-in transition-all">
      {/* Backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />

      <div className="relative bg-cream-50 rounded-t-[2.5rem] sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-hidden shadow-soft-player animate-slide-up border border-gold-200/50">
        {/* Drag handle for mobile */}
        <div className="sm:hidden w-12 h-1.5 bg-cream-300 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-200 bg-cream-50">
          <h3 className="text-xl font-bold text-cream-900">
            Thêm vào Playlist
          </h3>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center text-cream-500 hover:text-cream-950 rounded-full hover:bg-cream-200 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Track info - highlighted */}
        <div className="flex items-center gap-4 p-5 bg-gold-50/50 border-b border-gold-100">
          <img
            src={trackToAdd.thumbnail}
            alt={trackToAdd.title}
            className="w-14 h-14 rounded-xl object-cover shadow-soft-card"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-cream-900 truncate">
              {trackToAdd.title}
            </h4>
            <p className="text-xs font-medium text-cream-600 truncate mt-0.5">
              {trackToAdd.author}
            </p>
          </div>
        </div>

        {/* Action content */}
        <div className="overflow-y-auto max-h-[50vh] p-4 space-y-3 scrollbar-hide">
          {/* Create new playlist input area */}
          {isCreating ? (
            <div className="p-4 bg-cream-100 rounded-2xl border border-gold-300 shadow-soft-card animate-scale-in">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Tên playlist mới..."
                className="w-full bg-white text-cream-950 placeholder-cream-600/40 rounded-xl px-4 py-3 text-sm border border-cream-300 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-400/10 transition-all font-medium"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePlaylist();
                }}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-4 py-3 text-sm font-bold text-cream-600 hover:text-cream-900 rounded-xl hover:bg-cream-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 px-4 py-3 text-sm font-bold bg-gold-400 text-white rounded-xl shadow-soft-3d hover:bg-gold-500 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  Tạo & Thêm
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left bg-cream-50 hover:bg-accent-gold/5 border border-dashed border-cream-400 hover:border-gold-400 transition-all group active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center group-hover:bg-gold-200 transition-colors shadow-soft-3d-inset">
                <svg
                  className="w-6 h-6 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <span className="text-cream-900 font-bold block">
                  Tạo playlist mới
                </span>
                <p className="text-[10px] text-cream-600 font-medium">
                  Bắt đầu bộ sưu tập mới của bạn
                </p>
              </div>
            </button>
          )}

          {/* Existing playlists */}
          {playlists.length === 0 && !isCreating && (
            <div className="text-center py-12 text-cream-500">
              <span className="text-5xl block mb-4 opacity-30">📚</span>
              <p className="font-bold text-cream-600">
                Bạn chưa có playlist nào
              </p>
              <p className="text-xs px-10 mt-1">
                Hãy tạo một cái để gom những cuốn sách hay nhất!
              </p>
            </div>
          )}

          <div className="space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handleAddToPlaylist(playlist.id)}
                disabled={addingToId === playlist.id}
                className="w-full flex items-center gap-4 p-3 rounded-2xl text-left hover:bg-cream-200/60 transition-all group active:scale-[0.98] disabled:opacity-50"
              >
                {/* Playlist thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-cream-200 flex items-center justify-center overflow-hidden shadow-soft-3d-inset flex-shrink-0">
                  {playlist.thumbnail ? (
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-2xl">🎵</span>
                  )}
                </div>

                {/* Playlist info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-cream-900 truncate">
                    {playlist.name}
                  </h4>
                  <p className="text-[10px] font-bold text-cream-500 uppercase tracking-wider">
                    {playlist.trackCount} cuốn sách
                  </p>
                </div>

                {/* Loading indicator */}
                {addingToId === playlist.id ? (
                  <div className="w-6 h-6 border-3 border-gold-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-cream-400 group-hover:text-gold-500 group-hover:border-gold-300 group-hover:bg-white transition-all">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom padding for mobile safe area */}
        <div className="h-10 sm:h-6" />
      </div>
    </div>
  );
}

export default AddToPlaylistModal;
