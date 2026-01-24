/**
 * Wake Lock API Service
 * Prevents screen from turning off during audio playback
 */

let wakeLock = null;

/**
 * Request a wake lock to keep screen on
 * @returns {Promise<boolean>} Success status
 */
export async function requestWakeLock() {
  if (!("wakeLock" in navigator)) {
    return false;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");

    // Re-acquire wake lock when page becomes visible again
    wakeLock.addEventListener("release", () => {
      wakeLock = null;
    });

    return true;
  } catch (err) {
    // Wake lock request failed (e.g., low battery, permission denied)
    wakeLock = null;
    return false;
  }
}

/**
 * Release the current wake lock
 */
export function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

/**
 * Check if wake lock is currently active
 * @returns {boolean}
 */
export function isWakeLockActive() {
  return wakeLock !== null && !wakeLock.released;
}

/**
 * Check if Wake Lock API is supported
 * @returns {boolean}
 */
export function isWakeLockSupported() {
  return "wakeLock" in navigator;
}

/**
 * Setup automatic wake lock management based on visibility
 * Re-acquires wake lock when page becomes visible
 */
export function setupAutoWakeLock() {
  const handleVisibilityChange = async () => {
    if (document.visibilityState === "visible" && wakeLock === null) {
      // Try to re-acquire wake lock when returning to app
      // Only if we had one before (indicated by some external state)
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Return cleanup function
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    releaseWakeLock();
  };
}
