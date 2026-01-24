/**
 * Radio Context - State management for radio streaming
 * Separate from YouTube player to avoid audio conflicts
 */
import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  filterStations,
  getStationById,
  GENRES,
  MOODS,
} from "../services/radio";

const RadioContext = createContext(null);

// Initial state
const initialState = {
  currentStation: null,
  isPlaying: false,
  isLoading: false,
  isBuffering: false,
  error: null,
  selectedGenre: null,
  selectedMood: null,
  stations: [],
  volume: 100,
};

// Action types
const ACTIONS = {
  SET_STATION: "SET_STATION",
  SET_PLAYING: "SET_PLAYING",
  SET_LOADING: "SET_LOADING",
  SET_BUFFERING: "SET_BUFFERING",
  SET_ERROR: "SET_ERROR",
  SET_GENRE: "SET_GENRE",
  SET_MOOD: "SET_MOOD",
  SET_STATIONS: "SET_STATIONS",
  SET_VOLUME: "SET_VOLUME",
  RESET: "RESET",
};

function radioReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STATION:
      return { ...state, currentStation: action.payload, error: null };
    case ACTIONS.SET_PLAYING:
      return { ...state, isPlaying: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_BUFFERING:
      return { ...state, isBuffering: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ACTIONS.SET_GENRE:
      return { ...state, selectedGenre: action.payload };
    case ACTIONS.SET_MOOD:
      return { ...state, selectedMood: action.payload };
    case ACTIONS.SET_STATIONS:
      return { ...state, stations: action.payload };
    case ACTIONS.SET_VOLUME:
      return { ...state, volume: action.payload };
    case ACTIONS.RESET:
      return { ...initialState, stations: state.stations };
    default:
      return state;
  }
}

export function RadioProvider({ children }) {
  const [state, dispatch] = useReducer(radioReducer, initialState);
  const audioRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "none";

    // Audio event handlers
    const audio = audioRef.current;

    const handlePlay = () => {
      dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      dispatch({ type: ACTIONS.SET_BUFFERING, payload: false });
    };

    const handlePause = () => {
      dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
    };

    const handleWaiting = () => {
      dispatch({ type: ACTIONS.SET_BUFFERING, payload: true });
    };

    const handlePlaying = () => {
      dispatch({ type: ACTIONS.SET_BUFFERING, payload: false });
    };

    const handleError = () => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể kết nối radio" });
      dispatch({ type: ACTIONS.SET_PLAYING, payload: false });

      // Auto-retry after 5 seconds
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = setTimeout(() => {
        if (audio.src) {
          audio.load();
          audio.play().catch(() => {});
        }
      }, 5000);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);

      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Load initial stations
  useEffect(() => {
    const stations = filterStations(null, null);
    dispatch({ type: ACTIONS.SET_STATIONS, payload: stations });
  }, []);

  // Update stations when filters change
  useEffect(() => {
    const stations = filterStations(state.selectedGenre, state.selectedMood);
    dispatch({ type: ACTIONS.SET_STATIONS, payload: stations });
  }, [state.selectedGenre, state.selectedMood]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume / 100;
    }
  }, [state.volume]);

  // Load and play a station
  const loadStation = useCallback(async (station) => {
    if (!audioRef.current || !station) return;

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    dispatch({ type: ACTIONS.SET_STATION, payload: station });

    try {
      audioRef.current.src = station.url;
      audioRef.current.load();
      await audioRef.current.play();
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể phát radio" });
    }
  }, []);

  // Play radio
  const playRadio = useCallback(() => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(() => {
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể phát radio" });
      });
    }
  }, []);

  // Pause radio
  const pauseRadio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Toggle play/pause
  const toggleRadio = useCallback(() => {
    if (state.isPlaying) {
      pauseRadio();
    } else {
      playRadio();
    }
  }, [state.isPlaying, playRadio, pauseRadio]);

  // Set genre filter
  const setGenreFilter = useCallback(
    (genre) => {
      dispatch({
        type: ACTIONS.SET_GENRE,
        payload: state.selectedGenre === genre ? null : genre,
      });
    },
    [state.selectedGenre],
  );

  // Set mood filter
  const setMoodFilter = useCallback(
    (mood) => {
      dispatch({
        type: ACTIONS.SET_MOOD,
        payload: state.selectedMood === mood ? null : mood,
      });
    },
    [state.selectedMood],
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    dispatch({ type: ACTIONS.SET_GENRE, payload: null });
    dispatch({ type: ACTIONS.SET_MOOD, payload: null });
  }, []);

  // Set volume
  const setVolume = useCallback((volume) => {
    dispatch({ type: ACTIONS.SET_VOLUME, payload: volume });
  }, []);

  // Stop radio
  const stopRadio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    dispatch({ type: ACTIONS.RESET });
  }, []);

  const value = {
    ...state,
    genres: GENRES,
    moods: MOODS,
    loadStation,
    playRadio,
    pauseRadio,
    toggleRadio,
    setGenreFilter,
    setMoodFilter,
    clearFilters,
    setVolume,
    stopRadio,
  };

  return (
    <RadioContext.Provider value={value}>{children}</RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("useRadio must be used within RadioProvider");
  }
  return context;
}
