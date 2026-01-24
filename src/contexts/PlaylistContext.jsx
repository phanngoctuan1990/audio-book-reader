/**
 * Playlist Context - State management for playlist operations
 */
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
  clearPlaylist,
  updatePlaylistName,
  reorderPlaylist,
  searchInPlaylist,
} from "../services/playlist";

const PlaylistContext = createContext(null);

// Initial state
const initialState = {
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
  showAddModal: false,
  trackToAdd: null,
};

// Action types
const ACTIONS = {
  SET_PLAYLISTS: "SET_PLAYLISTS",
  SET_CURRENT_PLAYLIST: "SET_CURRENT_PLAYLIST",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SHOW_ADD_MODAL: "SHOW_ADD_MODAL",
  HIDE_ADD_MODAL: "HIDE_ADD_MODAL",
  ADD_PLAYLIST: "ADD_PLAYLIST",
  REMOVE_PLAYLIST: "REMOVE_PLAYLIST",
  UPDATE_PLAYLIST: "UPDATE_PLAYLIST",
};

function playlistReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PLAYLISTS:
      return { ...state, playlists: action.payload, isLoading: false };
    case ACTIONS.SET_CURRENT_PLAYLIST:
      return { ...state, currentPlaylist: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ACTIONS.SHOW_ADD_MODAL:
      return { ...state, showAddModal: true, trackToAdd: action.payload };
    case ACTIONS.HIDE_ADD_MODAL:
      return { ...state, showAddModal: false, trackToAdd: null };
    case ACTIONS.ADD_PLAYLIST:
      return { ...state, playlists: [action.payload, ...state.playlists] };
    case ACTIONS.REMOVE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.filter((p) => p.id !== action.payload),
        currentPlaylist:
          state.currentPlaylist?.id === action.payload
            ? null
            : state.currentPlaylist,
      };
    case ACTIONS.UPDATE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
        currentPlaylist:
          state.currentPlaylist?.id === action.payload.id
            ? action.payload
            : state.currentPlaylist,
      };
    default:
      return state;
  }
}

export function PlaylistProvider({ children }) {
  const [state, dispatch] = useReducer(playlistReducer, initialState);

  // Load playlists on mount
  useEffect(() => {
    loadPlaylists();
  }, []);

  // Load all playlists
  const loadPlaylists = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const playlists = await getPlaylists();
      dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: playlists });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể tải playlist" });
    }
  }, []);

  // Select a playlist
  const selectPlaylist = useCallback(async (playlistId) => {
    if (!playlistId) {
      dispatch({ type: ACTIONS.SET_CURRENT_PLAYLIST, payload: null });
      return;
    }

    try {
      const playlist = await getPlaylistById(playlistId);
      dispatch({ type: ACTIONS.SET_CURRENT_PLAYLIST, payload: playlist });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể tải playlist" });
    }
  }, []);

  // Create new playlist
  const createNewPlaylist = useCallback(async (name) => {
    try {
      const playlist = await createPlaylist(name);
      dispatch({
        type: ACTIONS.ADD_PLAYLIST,
        payload: { ...playlist, trackCount: 0 },
      });
      return playlist;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể tạo playlist" });
      return null;
    }
  }, []);

  // Add track to playlist
  const addTrackToPlaylist = useCallback(async (playlistId, track) => {
    try {
      const success = await addToPlaylist(playlistId, track);
      if (success) {
        const updatedPlaylist = await getPlaylistById(playlistId);
        dispatch({ type: ACTIONS.UPDATE_PLAYLIST, payload: updatedPlaylist });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Không thể thêm vào playlist",
      });
      return false;
    }
  }, []);

  // Remove track from playlist
  const removeTrackFromPlaylist = useCallback(async (playlistId, videoId) => {
    try {
      await removeFromPlaylist(playlistId, videoId);
      const updatedPlaylist = await getPlaylistById(playlistId);
      dispatch({ type: ACTIONS.UPDATE_PLAYLIST, payload: updatedPlaylist });
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Không thể xóa khỏi playlist",
      });
    }
  }, []);

  // Delete playlist
  const removePlaylist = useCallback(async (playlistId) => {
    try {
      await deletePlaylist(playlistId);
      dispatch({ type: ACTIONS.REMOVE_PLAYLIST, payload: playlistId });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể xóa playlist" });
    }
  }, []);

  // Clear all tracks from playlist
  const clearAllTracks = useCallback(async (playlistId) => {
    try {
      await clearPlaylist(playlistId);
      const updatedPlaylist = await getPlaylistById(playlistId);
      dispatch({ type: ACTIONS.UPDATE_PLAYLIST, payload: updatedPlaylist });
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Không thể xóa các bài hát",
      });
    }
  }, []);

  // Update playlist name
  const renamePlaylist = useCallback(async (playlistId, name) => {
    try {
      await updatePlaylistName(playlistId, name);
      const updatedPlaylist = await getPlaylistById(playlistId);
      dispatch({ type: ACTIONS.UPDATE_PLAYLIST, payload: updatedPlaylist });
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Không thể đổi tên playlist",
      });
    }
  }, []);

  // Reorder tracks
  const reorderTracks = useCallback(async (playlistId, fromIndex, toIndex) => {
    try {
      await reorderPlaylist(playlistId, fromIndex, toIndex);
      const updatedPlaylist = await getPlaylistById(playlistId);
      dispatch({ type: ACTIONS.UPDATE_PLAYLIST, payload: updatedPlaylist });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể sắp xếp lại" });
    }
  }, []);

  // Search in playlist
  const searchPlaylist = useCallback(async (playlistId, query) => {
    try {
      return await searchInPlaylist(playlistId, query);
    } catch (error) {
      return [];
    }
  }, []);

  // Show add to playlist modal
  const showAddToPlaylistModal = useCallback((track) => {
    dispatch({ type: ACTIONS.SHOW_ADD_MODAL, payload: track });
  }, []);

  // Hide add to playlist modal
  const hideAddToPlaylistModal = useCallback(() => {
    dispatch({ type: ACTIONS.HIDE_ADD_MODAL });
  }, []);

  const value = {
    ...state,
    loadPlaylists,
    selectPlaylist,
    createNewPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    removePlaylist,
    clearAllTracks,
    renamePlaylist,
    reorderTracks,
    searchPlaylist,
    showAddToPlaylistModal,
    hideAddToPlaylistModal,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within PlaylistProvider");
  }
  return context;
}
