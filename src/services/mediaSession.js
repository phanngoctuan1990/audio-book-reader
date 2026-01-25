/**
 * Media Session API Service
 * Provides lock screen and notification controls for audio playback
 *
 * IMPORTANT: YouTube IFrame API has limitations with background playback on mobile.
 * We use a silent audio element as a workaround to keep Media Session active.
 */

// Silent audio element to keep Media Session alive in background
let silentAudio = null;
let currentControls = null;

/**
 * Create silent audio element for background playback
 * This keeps the audio session alive when YouTube player would normally pause
 */
function createSilentAudio() {
  if (silentAudio) return silentAudio;

  // Create a very short silent audio (base64 encoded 1-second silent MP3)
  // This is a minimal silent MP3 file
  const silentMp3 =
    "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwMHAAAAAAD/+9DEAAAIAANIAAAAExBGa9AAABEREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREf/7UMQAgAAADSAAAAAAAAANIAAAABEREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREQ==";

  silentAudio = new Audio(silentMp3);
  silentAudio.loop = true;
  silentAudio.volume = 0.01; // Nearly silent but not muted (some browsers ignore muted)

  // Required for background playback on iOS
  silentAudio.setAttribute("playsinline", "true");
  silentAudio.setAttribute("webkit-playsinline", "true");

  return silentAudio;
}

/**
 * Start silent audio to keep session alive
 */
export function startSilentAudio() {
  const audio = createSilentAudio();

  // Try to play - may fail without user interaction
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Silent audio play failed - will try again on user interaction
    });
  }
}

/**
 * Stop silent audio
 */
export function stopSilentAudio() {
  if (silentAudio) {
    silentAudio.pause();
    silentAudio.currentTime = 0;
  }
}

/**
 * Setup Media Session with track metadata and control handlers
 * @param {Object} track - Current track info
 * @param {Object} controls - Control handlers
 */
export function setupMediaSession(track, controls) {
  if (!("mediaSession" in navigator)) return;

  // Store controls for background access
  currentControls = controls;

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

  // Set action handlers with retry mechanism
  try {
    navigator.mediaSession.setActionHandler("play", async () => {
      // Start silent audio to keep session alive
      startSilentAudio();

      // Execute the actual play control
      if (controls.play) {
        await controls.play();
      }
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      // Stop silent audio when pausing
      stopSilentAudio();

      if (controls.pause) {
        controls.pause();
      }
    });

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
      navigator.mediaSession.setActionHandler("stop", () => {
        stopSilentAudio();
        controls.stop();
      });
    }
  } catch (error) {
    // Some handlers may not be supported
  }
}

/**
 * Get current controls
 */
export function getCurrentControls() {
  return currentControls;
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
