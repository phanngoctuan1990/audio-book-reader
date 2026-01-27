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
import { getAudiobook, updatePlayPosition, addToHistory, getHistory } from "../services/db";
import { POSITION_SAVE_INTERVAL } from "../utils/constants";
import {
  setupMediaSession,
  updateMediaSessionState,
  updateMediaSessionPosition,
  clearMediaSession,
  startSilentAudio,
  stopSilentAudio,
} from "../services/mediaSession";
import { getBackgroundManager } from "../services/backgroundPlayback";
import { requestWakeLock, releaseWakeLock } from "../services/wakeLock";

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
  // Advanced controls
  repeatMode: "none", // 'none', 'one', 'all'
  autoPlayNext: true,
  isShuffled: false,
  originalQueue: [], // Store original queue for unshuffle
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
  // Advanced controls
  SET_REPEAT_MODE: "SET_REPEAT_MODE",
  TOGGLE_AUTO_PLAY: "TOGGLE_AUTO_PLAY",
  SET_SHUFFLE: "SET_SHUFFLE",
  SET_ORIGINAL_QUEUE: "SET_ORIGINAL_QUEUE",
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
    // Advanced controls
    case ACTIONS.SET_REPEAT_MODE:
      return { ...state, repeatMode: action.payload };
    case ACTIONS.TOGGLE_AUTO_PLAY:
      return { ...state, autoPlayNext: !state.autoPlayNext };
    case ACTIONS.SET_SHUFFLE:
      return { ...state, isShuffled: action.payload };
    case ACTIONS.SET_ORIGINAL_QUEUE:
      return { ...state, originalQueue: action.payload };
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
  const backgroundManagerRef = useRef(null);

  // Initialize background manager
  useEffect(() => {
    backgroundManagerRef.current = getBackgroundManager();

    return () => {
      if (backgroundManagerRef.current) {
        backgroundManagerRef.current.destroy();
      }
    };
  }, []);

  // Load saved playback speed
  useEffect(() => {
    const savedSpeed = localStorage.getItem("playbackSpeed");
    if (savedSpeed) {
      dispatch({ type: ACTIONS.SET_SPEED, payload: parseFloat(savedSpeed) });
    }
    // Load repeat mode
    const savedRepeat = localStorage.getItem("repeatMode");
    if (savedRepeat) {
      dispatch({ type: ACTIONS.SET_REPEAT_MODE, payload: savedRepeat });
    }
    // Load auto-play setting
    const savedAutoPlay = localStorage.getItem("autoPlayNext");
    if (savedAutoPlay !== null) {
      dispatch({
        type: savedAutoPlay === "false" ? ACTIONS.TOGGLE_AUTO_PLAY : null,
      });
      if (savedAutoPlay === "false") {
        dispatch({ type: ACTIONS.TOGGLE_AUTO_PLAY });
      }
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
        if (state.currentTrack?.videoId && state.currentTime > 0 && state.duration > 0) {
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

  // Enhanced Media Session API integration
  useEffect(() => {
    if (!state.currentTrack) {
      clearMediaSession();
      return;
    }

    // Setup Media Session with track info and controls
    setupMediaSession(state.currentTrack, {
      play: () => {
        playVideo();
        dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
      },
      pause: () => {
        pauseVideo();
        dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
      },
      previous: playPrevious,
      next: playNext,
      seekBackward: () => seekBy(-10),
      seekForward: () => seekBy(30),
      seekTo: (time) => {
        seekTo(time);
        dispatch({ type: ACTIONS.SET_TIME, payload: time });
      },
      stop: () => {
        pauseVideo();
        dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
      },
    });

    // Update background manager
    if (backgroundManagerRef.current) {
      backgroundManagerRef.current.setPlaying(state.isPlaying);
    }
  }, [state.currentTrack]);

  // Update Media Session playback state and manage silent audio
  useEffect(() => {
    updateMediaSessionState(state.isPlaying ? "playing" : "paused");

    // Update background manager
    if (backgroundManagerRef.current) {
      backgroundManagerRef.current.setPlaying(state.isPlaying);
    }

    // Manage wake lock and silent audio based on playback state
    if (state.isPlaying) {
      requestWakeLock();
      // Start silent audio to keep media session alive in background
      startSilentAudio();
    } else {
      releaseWakeLock();
      // Stop silent audio when paused
      stopSilentAudio();
    }
  }, [state.isPlaying]);

  // Update Media Session position for lock screen seekbar
  useEffect(() => {
    if (state.duration > 0 && state.currentTime >= 0) {
      updateMediaSessionPosition(
        state.currentTime,
        state.duration,
        state.playbackSpeed,
      );
    }
  }, [state.currentTime, state.duration, state.playbackSpeed]);

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

  // Handle track ended - enhanced with repeat logic
  const handleEnded = useCallback(() => {
    switch (state.repeatMode) {
      case "one":
        // Replay current track
        seekTo(0);
        playVideo();
        dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
        break;

      case "all":
        // Play next, or first if at end
        if (state.queueIndex < state.queue.length - 1) {
          const nextIndex = state.queueIndex + 1;
          dispatch({ type: ACTIONS.SET_QUEUE_INDEX, payload: nextIndex });
          loadTrack(state.queue[nextIndex]);
        } else if (state.queue.length > 0) {
          // Loop back to first track
          dispatch({ type: ACTIONS.SET_QUEUE_INDEX, payload: 0 });
          loadTrack(state.queue[0]);
        }
        break;

      case "none":
      default:
        // Play next if auto-play enabled
        if (state.autoPlayNext && state.queueIndex < state.queue.length - 1) {
          const nextIndex = state.queueIndex + 1;
          dispatch({ type: ACTIONS.SET_QUEUE_INDEX, payload: nextIndex });
          loadTrack(state.queue[nextIndex]);
        }
        break;
    }
  }, [state.repeatMode, state.autoPlayNext, state.queueIndex, state.queue]);

  // Load and play a track
  const loadTrack = async (track, startPosition = 0) => {
    dispatch({ type: ACTIONS.SET_TRACK, payload: track });
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });

    try {
      // Save as last track for session recovery
      localStorage.setItem("lastTrack", JSON.stringify(track));

      // Check for saved position in both stores
      if (startPosition === 0) {
        const cached = await getAudiobook(track.videoId);
        if (cached?.lastPosition > 0) {
          startPosition = cached.lastPosition;
        } else {
          // Fallback to history
          const history = await getHistory(50);
          const historyData = history.find(h => h.videoId === track.videoId);
          if (historyData?.lastPosition > 0) {
            startPosition = historyData.lastPosition;
          }
        }
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
    if (state.currentTrack && (!playerRef.current || !state.isPlayerReady)) {
      // If we have a track but player isn't ready (e.g. after reload), load it
      loadTrack(state.currentTrack, state.currentTime);
      return;
    }
    
    if (playerRef.current && state.isPlayerReady) {
      playVideo();
      dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
    }
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

  // Advanced controls
  const setRepeatMode = (mode) => {
    dispatch({ type: ACTIONS.SET_REPEAT_MODE, payload: mode });
    localStorage.setItem("repeatMode", mode);
  };

  const cycleRepeatMode = () => {
    const modes = ["none", "one", "all"];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const toggleAutoPlay = () => {
    dispatch({ type: ACTIONS.TOGGLE_AUTO_PLAY });
    localStorage.setItem("autoPlayNext", String(!state.autoPlayNext));
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    if (!state.isShuffled) {
      // Enable shuffle
      dispatch({ type: ACTIONS.SET_ORIGINAL_QUEUE, payload: state.queue });

      // Keep current track at position 0, shuffle rest
      const currentTrack = state.queue[state.queueIndex];
      const otherTracks = state.queue.filter((_, i) => i !== state.queueIndex);
      const shuffledOthers = shuffleArray(otherTracks);
      const newQueue = [currentTrack, ...shuffledOthers];

      dispatch({ type: ACTIONS.SET_QUEUE, payload: newQueue });
      dispatch({ type: ACTIONS.SET_QUEUE_INDEX, payload: 0 });
      dispatch({ type: ACTIONS.SET_SHUFFLE, payload: true });
    } else {
      // Disable shuffle - restore original queue
      const currentTrack = state.currentTrack;
      const originalQueue = state.originalQueue;

      // Find current track position in original queue
      const originalIndex = originalQueue.findIndex(
        (t) => t.videoId === currentTrack?.videoId,
      );

      dispatch({ type: ACTIONS.SET_QUEUE, payload: originalQueue });
      dispatch({
        type: ACTIONS.SET_QUEUE_INDEX,
        payload: originalIndex >= 0 ? originalIndex : 0,
      });
      dispatch({ type: ACTIONS.SET_SHUFFLE, payload: false });
    }
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
    // Advanced controls
    setRepeatMode,
    cycleRepeatMode,
    toggleAutoPlay,
    toggleShuffle,
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
