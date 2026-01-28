import { useEffect, useRef } from "react";
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
import { PLAYER_CONFIG } from "../utils/constants";

/**
 * Hook for managing background playback, media session, and wake lock
 */
export function usePlayerBackground(state, actions) {
  const backgroundManagerRef = useRef(null);
  const { play, pause, playNext, playPrevious, seekTo, seekBy } = actions;

  // 1. Initialize background manager
  useEffect(() => {
    backgroundManagerRef.current = getBackgroundManager();

    return () => {
      if (backgroundManagerRef.current) {
        backgroundManagerRef.current.destroy();
      }
    };
  }, []);

  // 2. Sync playback state with background manager
  useEffect(() => {
    if (backgroundManagerRef.current) {
      backgroundManagerRef.current.setPlaying(state.isPlaying);
    }
  }, [state.isPlaying]);

  // 3. Media Session API integration
  useEffect(() => {
    if (!state.currentTrack) {
      clearMediaSession();
      return;
    }

    // Setup Media Session with track info and controls
    setupMediaSession(state.currentTrack, {
      play,
      pause,
      previous: playPrevious,
      next: playNext,
      seekBackward: () => seekBy(-PLAYER_CONFIG.SEEK_BACKWARD_SECONDS),
      seekForward: () => seekBy(PLAYER_CONFIG.SEEK_FORWARD_SECONDS),
      seekTo: (time) => seekTo(time),
      stop: pause,
    });
  }, [state.currentTrack, play, pause, playNext, playPrevious, seekTo, seekBy]);

  // 4. Update Media Session playback state and manage silent audio / wake lock
  useEffect(() => {
    updateMediaSessionState(state.isPlaying ? "playing" : "paused");

    if (state.isPlaying) {
      requestWakeLock();
      startSilentAudio();
    } else {
      releaseWakeLock();
      stopSilentAudio();
    }
  }, [state.isPlaying]);

  // 5. Update Media Session position for lock screen seekbar
  useEffect(() => {
    if (state.duration > 0 && state.currentTime >= 0) {
      updateMediaSessionPosition(
        state.currentTime,
        state.duration,
        state.playbackSpeed,
      );
    }
  }, [state.currentTime, state.duration, state.playbackSpeed]);

  return null;
}
