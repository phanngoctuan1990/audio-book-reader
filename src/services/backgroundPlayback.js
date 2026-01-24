/**
 * Background Playback Manager
 * Handles background playback lifecycle and optimizations
 */

/**
 * Background Playback Manager Class
 * Manages app state when entering/exiting background
 */
export class BackgroundPlaybackManager {
  constructor() {
    this.isInBackground = false;
    this.isPlaying = false;
    this.onEnterBackgroundCallbacks = [];
    this.onEnterForegroundCallbacks = [];
    this.updateIntervalId = null;
    this.reducedUpdateInterval = 1000; // 1 second in background
    this.normalUpdateInterval = 250; // 250ms in foreground

    this.setupVisibilityHandlers();
  }

  /**
   * Setup visibility change handlers
   */
  setupVisibilityHandlers() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.handleEnterBackground();
      } else {
        this.handleEnterForeground();
      }
    });

    // Handle page unload
    window.addEventListener("beforeunload", (e) => {
      if (this.isPlaying) {
        // Warn user if audio is playing
        e.preventDefault();
        e.returnValue = "Audio đang phát. Bạn có chắc muốn thoát?";
        return e.returnValue;
      }
    });

    // Handle page freeze (for mobile browsers)
    if ("onfreeze" in document) {
      document.addEventListener("freeze", () => {
        this.handleEnterBackground();
      });
    }

    if ("onresume" in document) {
      document.addEventListener("resume", () => {
        this.handleEnterForeground();
      });
    }
  }

  /**
   * Handle entering background mode
   */
  handleEnterBackground() {
    if (this.isInBackground) return;

    this.isInBackground = true;

    // Execute callbacks
    this.onEnterBackgroundCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (e) {
        // Callback error
      }
    });
  }

  /**
   * Handle returning to foreground
   */
  handleEnterForeground() {
    if (!this.isInBackground) return;

    this.isInBackground = false;

    // Execute callbacks
    this.onEnterForegroundCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (e) {
        // Callback error
      }
    });
  }

  /**
   * Register callback for entering background
   * @param {Function} callback
   * @returns {Function} Cleanup function
   */
  onEnterBackground(callback) {
    this.onEnterBackgroundCallbacks.push(callback);
    return () => {
      const index = this.onEnterBackgroundCallbacks.indexOf(callback);
      if (index > -1) {
        this.onEnterBackgroundCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Register callback for entering foreground
   * @param {Function} callback
   * @returns {Function} Cleanup function
   */
  onEnterForeground(callback) {
    this.onEnterForegroundCallbacks.push(callback);
    return () => {
      const index = this.onEnterForegroundCallbacks.indexOf(callback);
      if (index > -1) {
        this.onEnterForegroundCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Set playing state
   * @param {boolean} playing
   */
  setPlaying(playing) {
    this.isPlaying = playing;
  }

  /**
   * Get current update interval based on visibility
   * @returns {number} Interval in milliseconds
   */
  getUpdateInterval() {
    return this.isInBackground
      ? this.reducedUpdateInterval
      : this.normalUpdateInterval;
  }

  /**
   * Check if app is in background
   * @returns {boolean}
   */
  isBackground() {
    return this.isInBackground;
  }

  /**
   * Cleanup manager
   */
  destroy() {
    this.onEnterBackgroundCallbacks = [];
    this.onEnterForegroundCallbacks = [];
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }
}

// Singleton instance
let backgroundManager = null;

/**
 * Get or create BackgroundPlaybackManager instance
 * @returns {BackgroundPlaybackManager}
 */
export function getBackgroundManager() {
  if (!backgroundManager) {
    backgroundManager = new BackgroundPlaybackManager();
  }
  return backgroundManager;
}

/**
 * Check if page is currently visible
 * @returns {boolean}
 */
export function isPageVisible() {
  return document.visibilityState === "visible";
}

/**
 * Check if audio can continue in background
 * Most modern browsers support this with proper Media Session setup
 * @returns {boolean}
 */
export function supportsBackgroundAudio() {
  // Most browsers support background audio playback
  // The key is proper Media Session API integration
  return "mediaSession" in navigator;
}
