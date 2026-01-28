// YouTube API Configuration
export const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
export const YOUTUBE_IFRAME_API = "https://www.youtube.com/iframe_api";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Player Configuration
export const PLAYER_CONFIG = {
  TIME_UPDATE_INTERVAL: 250, // ms
  POSITION_SAVE_INTERVAL: 10000, // ms
  SEEK_BACKWARD_SECONDS: 10, // seconds
  SEEK_FORWARD_SECONDS: 30, // seconds
  PROGRESS_FINISHED_THRESHOLD: 99, // percentage
  IN_PROGRESS_MIN_SECONDS: 10, // seconds
  DEFAULT_VOLUME: 100,
  PLAYER_CONTAINER_ID: "youtube-player-container",
};

// Playback Options
export const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
export const SLEEP_TIMER_OPTIONS = [5, 10, 15, 30, 45, 60, 90];

// Storage Keys
export const STORAGE_KEYS = {
  PLAYBACK_SPEED: "playbackSpeed",
  REPEAT_MODE: "repeatMode",
  AUTO_PLAY_NEXT: "autoPlayNext",
  LAST_TRACK: "lastTrack",
  PLAYER_QUEUE: "playerQueue",
  QUEUE_INDEX: "queueIndex",
  SEARCH_VIEW_MODE: "searchViewMode",
};

// IndexedDB config
export const DB_NAME = "VibeAudioDB";
export const DB_VERSION = 2;

// Store names
export const STORES = {
  AUDIOBOOKS: "audiobooks",
  HISTORY: "history",
  FAVORITES: "favorites",
  PLAYLISTS: "playlists",
  BOOKMARKS: "bookmarks",
  SETTINGS: "settings",
  SEARCH_HISTORY: "search_history",
};

// API & Search config
export const API_TIMEOUT = 5000;
export const SEARCH_DEBOUNCE = 500;
export const SEARCH_PREFIX = "Sách nói";
export const SEARCH_MAX_RESULTS = 30;
