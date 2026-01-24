/**
 * Media Session API Service
 * Provides lock screen and notification controls for audio playback
 */

/**
 * Setup Media Session with track metadata and control handlers
 * @param {Object} track - Current track info
 * @param {Object} controls - Control handlers
 */
export function setupMediaSession(track, controls) {
  if (!("mediaSession" in navigator)) return;

  // Set metadata with multiple artwork sizes
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.author || "Audiobook",
    album: "Vibe Audio",
    artwork: [
      { src: track.thumbnail, sizes: "96x96", type: "image/jpeg" },
      { src: track.thumbnail, sizes: "128x128", type: "image/jpeg" },
      { src: track.thumbnail, sizes: "192x192", type: "image/jpeg" },
      { src: track.thumbnail, sizes: "256x256", type: "image/jpeg" },
      { src: track.thumbnail, sizes: "384x384", type: "image/jpeg" },
      { src: track.thumbnail, sizes: "512x512", type: "image/jpeg" },
    ],
  });

  // Set action handlers
  try {
    navigator.mediaSession.setActionHandler("play", controls.play);
    navigator.mediaSession.setActionHandler("pause", controls.pause);
    navigator.mediaSession.setActionHandler("previoustrack", controls.previous);
    navigator.mediaSession.setActionHandler("nexttrack", controls.next);
    navigator.mediaSession.setActionHandler(
      "seekbackward",
      controls.seekBackward,
    );
    navigator.mediaSession.setActionHandler(
      "seekforward",
      controls.seekForward,
    );

    // SeekTo handler (for scrubbing on lock screen)
    if (controls.seekTo) {
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime !== undefined) {
          controls.seekTo(details.seekTime);
        }
      });
    }

    // Stop handler
    if (controls.stop) {
      navigator.mediaSession.setActionHandler("stop", controls.stop);
    }
  } catch (error) {
    // Some handlers may not be supported
  }
}

/**
 * Update Media Session playback state
 * @param {'playing'|'paused'|'none'} state - Playback state
 */
export function updateMediaSessionState(state) {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.playbackState = state;
}

/**
 * Update Media Session position state (for seekbar on lock screen)
 * @param {number} position - Current position in seconds
 * @param {number} duration - Total duration in seconds
 * @param {number} playbackRate - Current playback rate
 */
export function updateMediaSessionPosition(
  position,
  duration,
  playbackRate = 1,
) {
  if (!("mediaSession" in navigator)) return;
  if (!("setPositionState" in navigator.mediaSession)) return;
  if (duration <= 0 || position < 0) return;

  try {
    navigator.mediaSession.setPositionState({
      duration: duration,
      playbackRate: playbackRate,
      position: Math.min(position, duration),
    });
  } catch (error) {
    // Position state may fail on some browsers
  }
}

/**
 * Clear Media Session
 */
export function clearMediaSession() {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.metadata = null;
  navigator.mediaSession.playbackState = "none";

  // Clear action handlers
  const actions = [
    "play",
    "pause",
    "previoustrack",
    "nexttrack",
    "seekbackward",
    "seekforward",
    "seekto",
    "stop",
  ];
  actions.forEach((action) => {
    try {
      navigator.mediaSession.setActionHandler(action, null);
    } catch (e) {
      // Handler may not be supported
    }
  });
}

/**
 * Check if Media Session API is supported
 * @returns {boolean}
 */
export function isMediaSessionSupported() {
  return "mediaSession" in navigator;
}
