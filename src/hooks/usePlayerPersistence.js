import { useEffect } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { QUEUE_ACTIONS } from "./usePlayerQueue";

/**
 * Hook for managing player settings persistence (localStorage)
 * Centralizes all sync logic to decouple services and state managers
 */
export function usePlayerPersistence(
  state,
  queueState,
  dispatch,
  dispatchQueue,
) {
  // 4. Initial Load (Rest of settings)
  useEffect(() => {
    // Load playback speed
    const savedSpeed = localStorage.getItem(STORAGE_KEYS.PLAYBACK_SPEED);
    if (savedSpeed) {
      dispatch({ type: "SET_SPEED", payload: parseFloat(savedSpeed) });
    }

    // Load repeat mode
    const savedRepeat = localStorage.getItem(STORAGE_KEYS.REPEAT_MODE);
    if (savedRepeat) {
      dispatchQueue({
        type: QUEUE_ACTIONS.SET_REPEAT_MODE,
        payload: savedRepeat,
      });
    }

    // Load auto-play setting
    const savedAutoPlay = localStorage.getItem(STORAGE_KEYS.AUTO_PLAY_NEXT);
    if (savedAutoPlay !== null) {
      if (savedAutoPlay === "false") {
        dispatchQueue({ type: QUEUE_ACTIONS.TOGGLE_AUTO_PLAY });
      }
    }

    // Load Queue
    const savedQueue = localStorage.getItem(STORAGE_KEYS.PLAYER_QUEUE);
    const savedIndex = localStorage.getItem(STORAGE_KEYS.QUEUE_INDEX);
    if (savedQueue) {
      try {
        const queue = JSON.parse(savedQueue);
        dispatchQueue({ type: QUEUE_ACTIONS.SET_QUEUE, payload: queue });
        if (savedIndex) {
          dispatchQueue({
            type: QUEUE_ACTIONS.SET_QUEUE_INDEX,
            payload: parseInt(savedIndex),
          });
        }
      } catch (e) {
        // Ignore parse error
      }
    }
  }, [dispatch, dispatchQueue]);

  // 2. Auto-save settings on change
  useEffect(() => {
    if (state.playbackSpeed) {
      localStorage.setItem(
        STORAGE_KEYS.PLAYBACK_SPEED,
        String(state.playbackSpeed),
      );
    }
  }, [state.playbackSpeed]);

  useEffect(() => {
    if (queueState.repeatMode) {
      localStorage.setItem(STORAGE_KEYS.REPEAT_MODE, queueState.repeatMode);
    }
  }, [queueState.repeatMode]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.AUTO_PLAY_NEXT,
      String(queueState.autoPlayNext),
    );
  }, [queueState.autoPlayNext]);

  // 3. Persist Queue on change
  useEffect(() => {
    if (queueState.queue && queueState.queue.length > 0) {
      localStorage.setItem(
        STORAGE_KEYS.PLAYER_QUEUE,
        JSON.stringify(queueState.queue),
      );
    }
  }, [queueState.queue]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.QUEUE_INDEX,
      String(queueState.queueIndex),
    );
  }, [queueState.queueIndex]);

  // 3. Helper to save last track
  const saveLastTrack = (track) => {
    if (track) {
      localStorage.setItem(STORAGE_KEYS.LAST_TRACK, JSON.stringify(track));
    }
  };

  return {
    saveLastTrack,
  };
}
