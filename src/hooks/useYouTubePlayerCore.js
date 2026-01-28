import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  loadYouTubeAPI,
  createPlayer,
  destroyPlayer,
  loadVideoById,
  setVolume,
  getDuration,
  getCurrentTime,
  PlayerState,
} from "../services/youtube";
import { updatePlayPosition, addToHistory } from "../services/db";
import { PLAYER_CONFIG } from "../utils/constants";

/**
 * Hook for managing the core YouTube Player instance and events
 */
export function useYouTubePlayerCore(dispatch, handleEnded, state) {
  const playerRef = useRef(null);
  const containerId = PLAYER_CONFIG.PLAYER_CONTAINER_ID;
  const stateRef = useRef(state);
  const timeUpdateRef = useRef(null);
  const saveIntervalRef = useRef(null);

  // Sync stateRef for event handlers and intervals
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 1. Initialize API
  useEffect(() => {
    loadYouTubeAPI().catch(() => {
      dispatch({ type: "SET_ERROR", payload: "Không thể tải YouTube API" });
    });
  }, [dispatch]);

  // 2. Intervals (Time Update & Auto-save)
  useEffect(() => {
    if (state.isPlaying && state.isPlayerReady) {
      timeUpdateRef.current = setInterval(() => {
        const time = getCurrentTime();
        const dur = getDuration();
        dispatch({ type: "SET_TIME", payload: time });
        if (dur > 0 && stateRef.current.duration !== dur) {
          dispatch({ type: "SET_DURATION", payload: dur });
        }
      }, PLAYER_CONFIG.TIME_UPDATE_INTERVAL);
    }
    return () => clearInterval(timeUpdateRef.current);
  }, [state.isPlaying, state.isPlayerReady, dispatch]);

  useEffect(() => {
    if (state.isPlaying && state.currentTrack) {
      saveIntervalRef.current = setInterval(() => {
        const { currentTrack, currentTime, duration } = stateRef.current;
        if (currentTrack?.videoId && currentTime > 0 && duration > 0) {
          updatePlayPosition(currentTrack.videoId, currentTime);
          addToHistory(currentTrack, currentTime, duration);
        }
      }, PLAYER_CONFIG.POSITION_SAVE_INTERVAL);
    }
    return () => clearInterval(saveIntervalRef.current);
  }, [state.isPlaying, state.currentTrack?.videoId]);

  // 3. Player Event Handlers
  const handleStateChange = useCallback(
    (event) => {
      const playerState = event.data;
      switch (playerState) {
        case PlayerState.PLAYING:
          dispatch({ type: "SET_PLAYING", payload: true });
          dispatch({ type: "SET_BUFFERING", payload: false });
          dispatch({ type: "SET_LOADING", payload: false });
          break;
        case PlayerState.PAUSED:
          dispatch({ type: "SET_PLAYING", payload: false });
          break;
        case PlayerState.BUFFERING:
          dispatch({ type: "SET_BUFFERING", payload: true });
          break;
        case PlayerState.ENDED:
          dispatch({ type: "SET_PLAYING", payload: false });
          handleEnded();
          break;
        case PlayerState.CUED:
          dispatch({ type: "SET_LOADING", payload: false });
          break;
      }
    },
    [dispatch, handleEnded]
  );

  const handlePlayerReady = useCallback(
    (event) => {
      dispatch({ type: "SET_PLAYER_READY", payload: true });
      dispatch({ type: "SET_LOADING", payload: false });
      setVolume(state.volume);
      const dur = getDuration();
      if (dur > 0) {
        dispatch({ type: "SET_DURATION", payload: dur });
      }
    },
    [dispatch, state.volume],
  );

  const handlePlayerError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: "Không thể phát video này" });
    dispatch({ type: "SET_LOADING", payload: false });
  }, [dispatch]);

  // 3. Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyPlayer();
      playerRef.current = null;
    };
  }, []);

  return {
    playerRef,
    containerId,
    handleStateChange,
    handlePlayerReady,
    handlePlayerError,
  };
}
