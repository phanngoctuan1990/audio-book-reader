/**
 * Haptic Feedback Utility
 * Provides haptic feedback on supported devices
 */

// Check if vibration API is supported
function isVibrationSupported() {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

/**
 * Trigger a light haptic feedback (10ms)
 * Use for: button taps, toggles, selections
 */
export function hapticLight() {
  if (isVibrationSupported()) {
    navigator.vibrate(10);
  }
}

/**
 * Trigger a medium haptic feedback (20ms)
 * Use for: important actions, confirmations
 */
export function hapticMedium() {
  if (isVibrationSupported()) {
    navigator.vibrate(20);
  }
}

/**
 * Trigger a heavy haptic feedback (30ms)
 * Use for: errors, warnings, destructive actions
 */
export function hapticHeavy() {
  if (isVibrationSupported()) {
    navigator.vibrate(30);
  }
}

/**
 * Trigger a success pattern (double tap)
 * Use for: successful operations, achievements
 */
export function hapticSuccess() {
  if (isVibrationSupported()) {
    navigator.vibrate([10, 50, 10]);
  }
}

/**
 * Trigger an error pattern (triple short vibration)
 * Use for: errors, failed operations
 */
export function hapticError() {
  if (isVibrationSupported()) {
    navigator.vibrate([30, 30, 30, 30, 30]);
  }
}

/**
 * Trigger a notification pattern
 * Use for: alerts, notifications
 */
export function hapticNotification() {
  if (isVibrationSupported()) {
    navigator.vibrate([15, 100, 15]);
  }
}

/**
 * Create a ripple effect on click
 * @param {MouseEvent} event - Click event
 * @param {HTMLElement} container - Container element
 */
export function createRipple(event, container) {
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  container.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * Combined haptic and ripple effect
 * @param {MouseEvent} event - Click event
 * @param {HTMLElement} container - Container element
 * @param {'light' | 'medium' | 'heavy'} intensity - Haptic intensity
 */
export function interactiveFeedback(event, container, intensity = "light") {
  // Haptic feedback
  switch (intensity) {
    case "medium":
      hapticMedium();
      break;
    case "heavy":
      hapticHeavy();
      break;
    default:
      hapticLight();
  }

  // Visual ripple
  if (container) {
    createRipple(event, container);
  }
}

export default {
  hapticLight,
  hapticMedium,
  hapticHeavy,
  hapticSuccess,
  hapticError,
  hapticNotification,
  createRipple,
  interactiveFeedback,
};
