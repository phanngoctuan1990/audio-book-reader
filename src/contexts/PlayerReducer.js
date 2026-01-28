// Initial state
export const initialState = {
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  isBuffering: false,
  error: null,
  currentTime: 0,
  duration: 0,
  playbackSpeed: 1,
  volume: 100,
  isPlayerExpanded: false,
  isPlayerReady: false,
};

// Action types
export const ACTIONS = {
  SET_TRACK: "SET_TRACK",
  SET_PLAYING: "SET_PLAYING",
  SET_LOADING: "SET_LOADING",
  SET_BUFFERING: "SET_BUFFERING",
  SET_ERROR: "SET_ERROR",
  SET_TIME: "SET_TIME",
  SET_DURATION: "SET_DURATION",
  SET_SPEED: "SET_SPEED",
  SET_VOLUME: "SET_VOLUME",
  TOGGLE_EXPANDED: "TOGGLE_EXPANDED",
  SET_PLAYER_READY: "SET_PLAYER_READY",
  RESET: "RESET",
};

export function playerReducer(state, action) {
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
