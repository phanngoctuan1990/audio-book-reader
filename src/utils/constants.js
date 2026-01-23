// YouTube API Configuration
export const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
export const YOUTUBE_IFRAME_API = "https://www.youtube.com/iframe_api";

// Playback speeds
export const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Sleep timer options (minutes)
export const SLEEP_TIMER_OPTIONS = [5, 10, 15, 30, 45, 60, 90];

// IndexedDB config
export const DB_NAME = "VibeAudioDB";
export const DB_VERSION = 1;

// Store names
export const STORES = {
  AUDIOBOOKS: "audiobooks",
  HISTORY: "history",
  FAVORITES: "favorites",
  PLAYLISTS: "playlists",
  BOOKMARKS: "bookmarks",
  SETTINGS: "settings",
};

// API config
export const API_TIMEOUT = 5000; // 5 seconds
export const SEARCH_DEBOUNCE = 500; // 500ms

// Auto-save interval
export const POSITION_SAVE_INTERVAL = 10000; // 10 seconds

// Search prefix for Vietnamese audiobooks
export const SEARCH_PREFIX = "Sách nói";
