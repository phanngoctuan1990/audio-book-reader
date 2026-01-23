/**
 * Format seconds to MM:SS or HH:MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format bytes to human readable
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Format relative time (e.g., "3 ngày trước")
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Relative time string in Vietnamese
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  return `${Math.floor(days / 30)} tháng trước`;
}

/**
 * Format duration for display (e.g., "1h 23m")
 * @param {number|string} duration - Duration in seconds or "HH:MM:SS" format
 * @returns {string} Formatted duration
 */
export function formatDuration(duration) {
  if (!duration) return '';
  
  // Parse if string format
  let seconds = duration;
  if (typeof duration === 'string') {
    const parts = duration.split(':').map(p => parseInt(p, 10)).filter(n => !isNaN(n));
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      seconds = parts[0];
    } else {
      return duration; // Return as-is if can't parse
    }
  }
  
  if (isNaN(seconds) || seconds === 0) return '';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins} phút`;
}

/**
 * Format progress percentage
 * @param {number} current - Current position
 * @param {number} total - Total duration
 * @returns {number} Progress percentage (0-100)
 */
export function formatProgress(current, total) {
  if (!total || total === 0) return 0;
  return Math.round((current / total) * 100);
}
