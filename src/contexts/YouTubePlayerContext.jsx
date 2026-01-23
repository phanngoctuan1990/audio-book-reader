/**
 * YouTube Player Context
 * Manages YouTube player state and controls
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
  loadYouTubeAPI,
  createPlayer,
  destroyPlayer,
  playVideo,
  pauseVideo,
  seekTo,
  setVolume as ytSetVolume,
  setPlaybackRate,
  loadVideoById,
  getCurrentTime,
  getDuration,
  getPlayerState,
  PlayerState,
} from "../services/youtube";
import { getAudiobook, updatePlayPosition, addToHistory } from "../services/db";
import { POSITION_SAVE_INTERVAL } from "../utils/constants";

const YouTubePlayerContext = createContext(null);

// Initial state
const initialState = {
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  isBuffering: false,
  error: null,
  currentTime: 0,
  duration: 0,
  playbackSpeed: 1,
  volume: 100,
  queue: [],
  queueIndex: 0,
  isPlayerExpanded: false,
  isPlayerReady: false,
};

// Action types
const ACTIONS = {
  SET_TRACK: "SET_TRACK",
  SET_PLAYING: "SET_PLAYING",
  SET_LOADING: "SET_LOADING",
  SET_BUFFERING: "SET_BUFFERING",
  SET_ERROR: "SET_ERROR",
  SET_TIME: "SET_TIME",
  SET_DURATION: "SET_DURATION",
  SET_SPEED: "SET_SPEED",
  SET_VOLUME: "SET_VOLUME",
  SET_QUEUE: "SET_QUEUE",
  SET_QUEUE_INDEX: "SET_QUEUE_INDEX",
  TOGGLE_EXPANDED: "TOGGLE_EXPANDED",
  SET_PLAYER_READY: "SET_PLAYER_READY",
  RESET: "RESET",
};

function playerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TRACK:
      return { ...state, currentTrack: action.payload, error: null };
    case ACTIONS.SET_PLAYING:
      return { ...state, isPlaying: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_BUFFERING:
      return { ...state, isBuffering: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ACTIONS.SET_TIME:
      return { ...state, currentTime: action.payload };
    case ACTIONS.SET_DURATION:
      return { ...state, duration: action.payload };
    case ACTIONS.SET_SPEED:
      return { ...state, playbackSpeed: action.payload };
    case ACTIONS.SET_VOLUME:
      return { ...state, volume: action.payload };
    case ACTIONS.SET_QUEUE:
      return { ...state, queue: action.payload };
    case ACTIONS.SET_QUEUE_INDEX:
      return { ...state, queueIndex: action.payload };
    case ACTIONS.TOGGLE_EXPANDED:
      return { ...state, isPlayerExpanded: !state.isPlayerExpanded };
    case ACTIONS.SET_PLAYER_READY:
      return { ...state, isPlayerReady: action.payload };
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}

export function YouTubePlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const playerRef = useRef(null);
  const containerIdRef = useRef("youtube-player-container");
  const timeUpdateRef = useRef(null);
  const saveIntervalRef = useRef(null);

  // Load saved playback speed
  useEffect(() => {
    const savedSpeed = localStorage.getItem("playbackSpeed");
    if (savedSpeed) {
      dispatch({ type: ACTIONS.SET_SPEED, payload: parseFloat(savedSpeed) });
    }
  }, []);

  // Initialize YouTube API
  useEffect(() => {
    loadYouTubeAPI().catch(() => {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Không thể tải YouTube API",
      });
    });
  }, []);

  // Time update interval
  useEffect(() => {
    if (state.isPlaying && state.isPlayerReady) {
      timeUpdateRef.current = setInterval(() => {
        const time = getCurrentTime();
        const dur = getDuration();
        dispatch({ type: ACTIONS.SET_TIME, payload: time });
        if (dur > 0 && state.duration !== dur) {
          dispatch({ type: ACTIONS.SET_DURATION, payload: dur });
        }
      }, 250);
    }

    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }
    };
  }, [state.isPlaying, state.isPlayerReady]);

  // Auto-save position
  useEffect(() => {
    if (state.isPlaying && state.currentTrack) {
      saveIntervalRef.current = setInterval(() => {
        if (state.currentTrack?.videoId && state.currentTime > 0) {
          updatePlayPosition(state.currentTrack.videoId, state.currentTime);
          addToHistory(state.currentTrack, state.currentTime, state.duration);
        }
      }, POSITION_SAVE_INTERVAL);
    }

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [
    state.isPlaying,
    state.currentTrack?.videoId,
    state.currentTime,
    state.duration,
  ]);

  // Media Session API integration
  useEffect(() => {
    if (!state.currentTrack || !("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: state.currentTrack.title,
      artist: state.currentTrack.author || "Audiobook",
      album: "Vibe Audio",
      artwork: [
        {
          src: state.currentTrack.thumbnail,
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("seekbackward", () => seekBy(-10));
    navigator.mediaSession.setActionHandler("seekforward", () => seekBy(30));
    navigator.mediaSession.setActionHandler("previoustrack", playPrevious);
    navigator.mediaSession.setActionHandler("nexttrack", playNext);
  }, [state.currentTrack]);

  // Handle player state change
  const handleStateChange = useCallback((event) => {
    const playerState = event.data;

    switch (playerState) {
      case PlayerState.PLAYING:
        dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_BUFFERING, payload: false });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        break;
      case PlayerState.PAUSED:
        dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
        break;
      case PlayerState.BUFFERING:
        dispatch({ type: ACTIONS.SET_BUFFERING, payload: true });
        break;
      case PlayerState.ENDED:
        dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
        handleEnded();
        break;
      case PlayerState.CUED:
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        break;
      default:
        break;
    }
  }, []);

  // Handle player ready
  const handlePlayerReady = useCallback(
    (event) => {
      dispatch({ type: ACTIONS.SET_PLAYER_READY, payload: true });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });

      // Apply saved settings
      const savedSpeed = localStorage.getItem("playbackSpeed");
      if (savedSpeed) {
        setPlaybackRate(parseFloat(savedSpeed));
      }
      ytSetVolume(state.volume);

      // Get duration
      const dur = getDuration();
      if (dur > 0) {
        dispatch({ type: ACTIONS.SET_DURATION, payload: dur });
      }
    },
    [state.volume],
  );

  // Handle player error
  const handlePlayerError = useCallback((event) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: "Không thể phát video này" });
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  }, []);

  // Handle track ended
  const handleEnded = useCallback(() => {
    if (state.queueIndex < state.queue.length - 1) {
      playNext();
    }
  }, [state.queueIndex, state.queue.length]);

  // Load and play a track
  const loadTrack = async (track, startPosition = 0) => {
    dispatch({ type: ACTIONS.SET_TRACK, payload: track });
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });

    try {
      // Check for saved position
      const cached = await getAudiobook(track.videoId);
      if (cached?.lastPosition > 0 && startPosition === 0) {
        startPosition = cached.lastPosition;
      }

      // If player exists, just load new video
      if (playerRef.current && state.isPlayerReady) {
        loadVideoById(track.videoId, startPosition);
      } else {
        // Create new player
        destroyPlayer();

        playerRef.current = await createPlayer(
          containerIdRef.current,
          track.videoId,
          {
            autoplay: true,
            onReady: handlePlayerReady,
            onStateChange: handleStateChange,
            onError: handlePlayerError,
            playerVars: {
              start: Math.floor(startPosition),
            },
          },
        );
      }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const play = () => {
    playVideo();
    dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
  };

  const pause = () => {
    pauseVideo();
    dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
  };

  const toggle = () => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time) => {
    seekTo(time);
    dispatch({ type: ACTIONS.SET_TIME, payload: time });
  };

  const seekBy = (delta) => {
    const newTime = Math.max(
      0,
      Math.min(state.duration, state.currentTime + delta),
    );
    seek(newTime);
  };

  const setSpeed = (speed) => {
    setPlaybackRate(speed);
    dispatch({ type: ACTIONS.SET_SPEED, payload: speed });
    localStorage.setItem("playbackSpeed", String(speed));
  };

  const setVolume = (volume) => {
    ytSetVolume(volume);
    dispatch({ type: ACTIONS.SET_VOLUME, payload: volume });
  };

  // Queue management
  const setQueue = (tracks, startIndex = 0) => {
    dispatch({ type: ACTIONS.SET_QUEUE, payload: tracks });
    dispatch({ type: ACTIONS.SET_QUEUE_INDEX, payload: startIndex });
    if (tracks[startIndex]) {
      loadTrack(tracks[startIndex]);
    }
  };

  const playNext = () => {
    if (state.queueIndex < state.queue.length - 1) {
      const nextIndex = state.queueIndex + 1;
      dispatch({ type: ACTIONS.SET_QUEUE_INDEX, payload: nextIndex });
      loadTrack(state.queue[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (state.currentTime > 3) {
      seek(0);
    } else if (state.queueIndex > 0) {
      const prevIndex = state.queueIndex - 1;
      dispatch({ type: ACTIONS.SET_QUEUE_INDEX, payload: prevIndex });
      loadTrack(state.queue[prevIndex]);
    }
  };

  const addToQueue = (track) => {
    dispatch({ type: ACTIONS.SET_QUEUE, payload: [...state.queue, track] });
  };

  const toggleExpanded = () => dispatch({ type: ACTIONS.TOGGLE_EXPANDED });

  const closePlayer = () => {
    pause();
    destroyPlayer();
    playerRef.current = null;
    dispatch({ type: ACTIONS.RESET });
  };

  const value = {
    ...state,
    containerId: containerIdRef.current,
    loadTrack,
    play,
    pause,
    toggle,
    seek,
    seekBy,
    setSpeed,
    setVolume,
    setQueue,
    playNext,
    playPrevious,
    addToQueue,
    toggleExpanded,
    closePlayer,
  };

  return (
    <YouTubePlayerContext.Provider value={value}>
      {children}
      {/* Hidden YouTube player container */}
      <div
        id={containerIdRef.current}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />
    </YouTubePlayerContext.Provider>
  );
}

export function useYouTubePlayer() {
  const context = useContext(YouTubePlayerContext);
  if (!context) {
    throw new Error(
      "useYouTubePlayer must be used within YouTubePlayerProvider",
    );
  }
  return context;
}
