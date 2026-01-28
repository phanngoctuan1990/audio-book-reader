import { useReducer, useCallback } from "react";
import { STORAGE_KEYS } from "../utils/constants";

// Action types
export const QUEUE_ACTIONS = {
  SET_QUEUE: "SET_QUEUE",
  SET_QUEUE_INDEX: "SET_QUEUE_INDEX",
  SET_REPEAT_MODE: "SET_REPEAT_MODE",
  TOGGLE_AUTO_PLAY: "TOGGLE_AUTO_PLAY",
  SET_SHUFFLE: "SET_SHUFFLE",
  SET_ORIGINAL_QUEUE: "SET_ORIGINAL_QUEUE",
  REMOVE_FROM_QUEUE: "REMOVE_FROM_QUEUE",
};

const initialQueueState = {
  queue: [],
  queueIndex: 0,
  repeatMode: "none", // 'none', 'one', 'all'
  autoPlayNext: true,
  isShuffled: false,
  originalQueue: [],
};

function queueReducer(state, action) {
  switch (action.type) {
    case QUEUE_ACTIONS.SET_QUEUE:
      return { ...state, queue: action.payload };
    case QUEUE_ACTIONS.SET_QUEUE_INDEX:
      return { ...state, queueIndex: action.payload };
    case QUEUE_ACTIONS.SET_REPEAT_MODE:
      return { ...state, repeatMode: action.payload };
    case QUEUE_ACTIONS.TOGGLE_AUTO_PLAY:
      return { ...state, autoPlayNext: !state.autoPlayNext };
    case QUEUE_ACTIONS.SET_SHUFFLE:
      return { ...state, isShuffled: action.payload };
    case QUEUE_ACTIONS.SET_ORIGINAL_QUEUE:
      return { ...state, originalQueue: action.payload };
    case QUEUE_ACTIONS.REMOVE_FROM_QUEUE: {
      const indexToRemove = action.payload;
      const newQueue = state.queue.filter((_, i) => i !== indexToRemove);
      let newIndex = state.queueIndex;
      if (indexToRemove < state.queueIndex) {
        newIndex = state.queueIndex - 1;
      } else if (indexToRemove === state.queueIndex) {
        newIndex = Math.min(state.queueIndex, newQueue.length - 1);
      }
      return { ...state, queue: newQueue, queueIndex: Math.max(0, newIndex) };
    }
    default:
      return state;
  }
}

/**
 * Hook for managing player queue, shuffle, and repeat modes
 */
export function usePlayerQueue(
  onLoadTrack,
  currentTime,
  seekTo,
  playVideo,
  setPlaying,
) {
  const [state, dispatch] = useReducer(queueReducer, initialQueueState);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const setRepeatMode = useCallback((mode) => {
    dispatch({ type: QUEUE_ACTIONS.SET_REPEAT_MODE, payload: mode });
  }, []);

  const cycleRepeatMode = useCallback(() => {
    const modes = ["none", "one", "all"];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [state.repeatMode, setRepeatMode]);

  const toggleAutoPlay = useCallback(() => {
    dispatch({ type: QUEUE_ACTIONS.TOGGLE_AUTO_PLAY });
  }, []);

  const toggleShuffle = useCallback(() => {
    if (!state.isShuffled) {
      dispatch({
        type: QUEUE_ACTIONS.SET_ORIGINAL_QUEUE,
        payload: state.queue,
      });
      const currentTrack = state.queue[state.queueIndex];
      const otherTracks = state.queue.filter((_, i) => i !== state.queueIndex);
      const shuffledOthers = shuffleArray(otherTracks);
      const newQueue = [currentTrack, ...shuffledOthers];

      dispatch({ type: QUEUE_ACTIONS.SET_QUEUE, payload: newQueue });
      dispatch({ type: QUEUE_ACTIONS.SET_QUEUE_INDEX, payload: 0 });
      dispatch({ type: QUEUE_ACTIONS.SET_SHUFFLE, payload: true });
    } else {
      const originalQueue = state.originalQueue;
      const currentTrack = state.queue[state.queueIndex];
      const originalIndex = originalQueue.findIndex(
        (t) => t.videoId === currentTrack?.videoId,
      );

      dispatch({ type: QUEUE_ACTIONS.SET_QUEUE, payload: originalQueue });
      dispatch({
        type: QUEUE_ACTIONS.SET_QUEUE_INDEX,
        payload: originalIndex >= 0 ? originalIndex : 0,
      });
      dispatch({ type: QUEUE_ACTIONS.SET_SHUFFLE, payload: false });
    }
  }, [
    state.isShuffled,
    state.queue,
    state.queueIndex,
    state.originalQueue,
    shuffleArray,
  ]);

  const playNext = useCallback(() => {
    if (state.queueIndex < state.queue.length - 1) {
      const nextIndex = state.queueIndex + 1;
      dispatch({ type: QUEUE_ACTIONS.SET_QUEUE_INDEX, payload: nextIndex });
      onLoadTrack(state.queue[nextIndex]);
    }
  }, [state.queueIndex, state.queue, onLoadTrack]);

  const playPrevious = useCallback(() => {
    if (currentTime > 3) {
      seekTo(0);
    } else if (state.queueIndex > 0) {
      const prevIndex = state.queueIndex - 1;
      dispatch({ type: QUEUE_ACTIONS.SET_QUEUE_INDEX, payload: prevIndex });
      onLoadTrack(state.queue[prevIndex]);
    }
  }, [currentTime, state.queueIndex, state.queue, seekTo, onLoadTrack]);

  const handleEnded = useCallback(() => {
    switch (state.repeatMode) {
      case "one":
        seekTo(0);
        playVideo();
        setPlaying(true);
        break;
      case "all":
        if (state.queueIndex < state.queue.length - 1) {
          playNext();
        } else if (state.queue.length > 0) {
          dispatch({ type: QUEUE_ACTIONS.SET_QUEUE_INDEX, payload: 0 });
          onLoadTrack(state.queue[0]);
        }
        break;
      case "none":
      default:
        if (state.autoPlayNext) {
          playNext();
        }
        break;
    }
  }, [
    state.repeatMode,
    state.autoPlayNext,
    state.queueIndex,
    state.queue,
    playNext,
    seekTo,
    playVideo,
    setPlaying,
    onLoadTrack,
  ]);

  const setQueue = useCallback(
    (tracks, startIndex = 0) => {
      dispatch({ type: QUEUE_ACTIONS.SET_QUEUE, payload: tracks });
      dispatch({ type: QUEUE_ACTIONS.SET_QUEUE_INDEX, payload: startIndex });
      if (tracks[startIndex]) {
        onLoadTrack(tracks[startIndex]);
      }
    },
    [onLoadTrack],
  );

  const addToQueue = useCallback(
    (track) => {
      dispatch({
        type: QUEUE_ACTIONS.SET_QUEUE,
        payload: [...state.queue, track],
      });
    },
    [state.queue],
  );

  const removeFromQueue = useCallback((index) => {
    dispatch({ type: QUEUE_ACTIONS.REMOVE_FROM_QUEUE, payload: index });
  }, []);

  return {
    ...state,
    setQueue,
    playNext,
    playPrevious,
    addToQueue,
    setRepeatMode,
    cycleRepeatMode,
    toggleAutoPlay,
    toggleShuffle,
    handleEnded,
    removeFromQueue,
    dispatchQueue: dispatch,
  };
}
