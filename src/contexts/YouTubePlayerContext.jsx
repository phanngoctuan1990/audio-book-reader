/**
 * YouTube Player Context
 * Manages YouTube player state and controls (Refactored v2)
 */
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { usePlayerQueue } from "../hooks/usePlayerQueue";
import { usePlayerPersistence } from "../hooks/usePlayerPersistence";
import { usePlayerBackground } from "../hooks/usePlayerBackground";
import { useYouTubePlayerCore } from "../hooks/useYouTubePlayerCore";
import { playerReducer, initialState, ACTIONS } from "./PlayerReducer";
import {
  playVideo,
  pauseVideo,
  seekTo,
  setVolume as ytSetVolume,
  setPlaybackRate,
  loadVideoById,
  destroyPlayer,
  createPlayer,
} from "../services/youtube";
import { getAudiobook, getHistory } from "../services/db";
import { STORAGE_KEYS } from "../utils/constants";

const PlayerStateContext = createContext(null);
const PlayerActionsContext = createContext(null);

export function YouTubePlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const stateRef = useRef(state);

  // Sync stateRef for stable actions
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 1. Core Player logic (Lifecycle, Events, Intervals)
  const {
    playerRef,
    containerId,
    handleStateChange,
    handlePlayerReady,
    handlePlayerError,
  } = useYouTubePlayerCore(dispatch, () => queueManager.handleEnded(), state);

  // 2. Queue logic
  const queueManager = usePlayerQueue(
    (track, pos) => loadTrack(track, pos),
    state.currentTime,
    (time) => seek(time),
    playVideo,
    (playing) => dispatch({ type: ACTIONS.SET_PLAYING, payload: playing }),
  );

  // 3. Persistence logic
  const { saveLastTrack } = usePlayerPersistence(
    state,
    queueManager,
    dispatch,
    queueManager.dispatchQueue,
  );

  // 4. Background/MediaSession logic
  usePlayerBackground(state, {
    play: () => play(),
    pause: () => pause(),
    playNext: queueManager.playNext,
    playPrevious: queueManager.playPrevious,
    seekTo: (time) => seek(time),
    seekBy: (delta) => seekBy(delta),
  });

  // 5. Initial track recovery
  useEffect(() => {
    const savedTrack = localStorage.getItem(STORAGE_KEYS.LAST_TRACK);
    if (savedTrack && !stateRef.current.currentTrack) {
      try {
        const track = JSON.parse(savedTrack);
        // Load target track but don't autoplay immediately if the user just opened the app
        loadTrack(track, 0);
      } catch (e) {
        // Ignore
      }
    }
  }, [loadTrack]);

  // 6. Actions implementation
  const loadTrack = useCallback(
    async (track, startPosition = 0) => {
      dispatch({ type: ACTIONS.SET_TRACK, payload: track });
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });

      try {
        saveLastTrack(track);
        if (startPosition === 0) {
          const cached = await getAudiobook(track.videoId);
          const history = cached ? null : await getHistory(50);
          const savedPos =
            cached?.lastPosition ||
            history?.find((h) => h.videoId === track.videoId)?.lastPosition ||
            0;
          startPosition = savedPos;
        }

        if (playerRef.current && stateRef.current.isPlayerReady) {
          loadVideoById(track.videoId, startPosition);
        } else {
          destroyPlayer();
          playerRef.current = await createPlayer(containerId, track.videoId, {
            autoplay: true,
            onReady: handlePlayerReady,
            onStateChange: handleStateChange,
            onError: handlePlayerError,
            playerVars: { start: Math.floor(startPosition) },
          });
        }
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    },
    [
      saveLastTrack,
      playerRef,
      containerId,
      handlePlayerReady,
      handleStateChange,
      handlePlayerError,
      dispatch,
    ],
  );

  const play = useCallback(() => {
    const s = stateRef.current;
    if (s.currentTrack && (!playerRef.current || !s.isPlayerReady)) {
      loadTrack(s.currentTrack, s.currentTime);
    } else if (playerRef.current && s.isPlayerReady) {
      playVideo();
      dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
    }
  }, [loadTrack, playerRef, dispatch]);

  const pause = useCallback(() => {
    pauseVideo();
    dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
  }, [dispatch]);

  const seek = useCallback(
    (time) => {
      seekTo(time);
      dispatch({ type: ACTIONS.SET_TIME, payload: time });
    },
    [dispatch],
  );

  const seekBy = useCallback(
    (delta) => {
      const { currentTime, duration } = stateRef.current;
      const newTime = Math.max(0, Math.min(duration, currentTime + delta));
      seek(newTime);
    },
    [seek],
  );

  const setSpeed = useCallback(
    (speed) => {
      setPlaybackRate(speed);
      dispatch({ type: ACTIONS.SET_SPEED, payload: speed });
    },
    [dispatch],
  );

  const toggle = useCallback(() => {
    if (stateRef.current.isPlaying) pause();
    else play();
  }, [play, pause]);

  const actions = useMemo(
    () => ({
      loadTrack,
      play,
      pause,
      toggle,
      seek,
      seekBy,
      setSpeed,
      setVolume: (v) => {
        ytSetVolume(v);
        dispatch({ type: ACTIONS.SET_VOLUME, payload: v });
      },
      toggleExpanded: () => dispatch({ type: ACTIONS.TOGGLE_EXPANDED }),
      closePlayer: () => {
        pause();
        destroyPlayer();
        playerRef.current = null;
        dispatch({ type: ACTIONS.RESET });
      },
      ...queueManager,
    }),
    [
      loadTrack,
      play,
      pause,
      toggle,
      seek,
      seekBy,
      setSpeed,
      queueManager,
      playerRef,
      containerId,
      dispatch,
    ],
  );

  return (
    <PlayerStateContext.Provider value={state}>
      <PlayerActionsContext.Provider value={actions}>
        {children}
        <div
          id={containerId}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
        />
      </PlayerActionsContext.Provider>
    </PlayerStateContext.Provider>
  );
}

export const useYouTubePlayer = () => ({
  ...useContext(PlayerStateContext),
  ...useContext(PlayerActionsContext),
});
