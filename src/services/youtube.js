/**
 * YouTube Service - IFrame Player API & Data API v3 Integration
 * Minimal implementation for audiobook streaming
 */

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_IFRAME_API = "https://www.youtube.com/iframe_api";

// Player instance reference
let player = null;
let isAPIReady = false;
let apiReadyPromise = null;

/**
 * Load YouTube IFrame Player API
 * @returns {Promise<void>}
 */
export function loadYouTubeAPI() {
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise((resolve) => {
    if (isAPIReady && window.YT) {
      resolve();
      return;
    }

    // Create callback for API ready
    window.onYouTubeIframeAPIReady = () => {
      isAPIReady = true;
      resolve();
    };

    // Load script
    const script = document.createElement("script");
    script.src = YOUTUBE_IFRAME_API;
    script.async = true;
    document.head.appendChild(script);
  });

  return apiReadyPromise;
}

/**
 * Create YouTube player instance
 * @param {string} containerId - DOM element ID for player
 * @param {string} videoId - YouTube video ID
 * @param {Object} options - Player options
 * @returns {Promise<YT.Player>}
 */
export async function createPlayer(containerId, videoId, options = {}) {
  await loadYouTubeAPI();

  return new Promise((resolve, reject) => {
    try {
      player = new window.YT.Player(containerId, {
        videoId,
        height: options.height || "0",
        width: options.width || "0",
        playerVars: {
          autoplay: options.autoplay ? 1 : 0,
          controls: 0, // Hide YouTube controls
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          ...options.playerVars,
        },
        events: {
          onReady: (event) => {
            if (options.onReady) options.onReady(event);
            resolve(player);
          },
          onStateChange: (event) => {
            if (options.onStateChange) options.onStateChange(event);
          },
          onError: (event) => {
            if (options.onError) options.onError(event);
            reject(new Error(`YouTube Player Error: ${event.data}`));
          },
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get current player instance
 * @returns {YT.Player|null}
 */
export function getPlayer() {
  return player;
}

/**
 * Destroy current player instance
 */
export function destroyPlayer() {
  if (player) {
    player.destroy();
    player = null;
  }
}

// =============================================================================
// Player Controls
// =============================================================================

/**
 * Play video
 */
export function playVideo() {
  if (player?.playVideo) player.playVideo();
}

/**
 * Pause video
 */
export function pauseVideo() {
  if (player?.pauseVideo) player.pauseVideo();
}

/**
 * Seek to specific time
 * @param {number} seconds - Time in seconds
 * @param {boolean} allowSeekAhead - Allow seeking ahead of buffered data
 */
export function seekTo(seconds, allowSeekAhead = true) {
  if (player?.seekTo) player.seekTo(seconds, allowSeekAhead);
}

/**
 * Set volume
 * @param {number} volume - Volume level (0-100)
 */
export function setVolume(volume) {
  if (player?.setVolume) player.setVolume(volume);
}

/**
 * Get current playback time
 * @returns {number} Current time in seconds
 */
export function getCurrentTime() {
  return player?.getCurrentTime?.() || 0;
}

/**
 * Get video duration
 * @returns {number} Duration in seconds
 */
export function getDuration() {
  return player?.getDuration?.() || 0;
}

/**
 * Get player state
 * @returns {number} Player state code
 */
export function getPlayerState() {
  return player?.getPlayerState?.() ?? -1;
}

/**
 * Set playback rate
 * @param {number} rate - Playback rate (0.25 to 2)
 */
export function setPlaybackRate(rate) {
  if (player?.setPlaybackRate) player.setPlaybackRate(rate);
}

/**
 * Load a new video
 * @param {string} videoId - YouTube video ID
 * @param {number} startSeconds - Start time in seconds
 */
export function loadVideoById(videoId, startSeconds = 0) {
  if (player?.loadVideoById) {
    player.loadVideoById({ videoId, startSeconds });
  }
}

/**
 * Cue a video without playing
 * @param {string} videoId - YouTube video ID
 * @param {number} startSeconds - Start time in seconds
 */
export function cueVideoById(videoId, startSeconds = 0) {
  if (player?.cueVideoById) {
    player.cueVideoById({ videoId, startSeconds });
  }
}

// =============================================================================
// YouTube Data API v3
// =============================================================================

/**
 * Search videos via YouTube Data API v3
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results (default: 20)
 * @returns {Promise<Array>} Search results
 */
export async function searchVideos(query, maxResults = 20) {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API key not configured");
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(maxResults),
    key: YOUTUBE_API_KEY,
  });

  try {
    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Search failed");
    }

    const data = await response.json();

    // Get video IDs for duration info
    const videoIds = data.items.map((item) => item.id.videoId).join(",");
    const details = await getVideosDetails(videoIds);

    // Merge search results with details
    return data.items.map((item) => {
      const detail = details.find((d) => d.id === item.id.videoId);
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        duration: detail?.duration || "",
        views: detail?.viewCount || "",
        uploadedDate: item.snippet.publishedAt,
        description: item.snippet.description,
      };
    });
  } catch (error) {
    throw new Error("Không thể tìm kiếm. Vui lòng thử lại.");
  }
}

/**
 * Get video details
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Video details
 */
export async function getVideoDetails(videoId) {
  const results = await getVideosDetails(videoId);
  return results[0] || null;
}

/**
 * Get multiple videos details
 * @param {string} videoIds - Comma-separated video IDs
 * @returns {Promise<Array>} Videos details
 */
export async function getVideosDetails(videoIds) {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API key not configured");
  }

  const params = new URLSearchParams({
    part: "contentDetails,statistics,snippet",
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  try {
    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to get video details");
    }

    const data = await response.json();

    return data.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url,
      duration: parseDuration(item.contentDetails.duration),
      viewCount: formatViewCount(item.statistics.viewCount),
      description: item.snippet.description,
    }));
  } catch (error) {
    return [];
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Parse ISO 8601 duration to readable format
 * @param {string} duration - ISO 8601 duration (PT1H2M3S)
 * @returns {string} Formatted duration (1:02:03)
 */
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Format view count to readable format
 * @param {string} count - View count
 * @returns {string} Formatted count (1.2M views)
 */
function formatViewCount(count) {
  const num = parseInt(count);
  if (isNaN(num)) return "";

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
}

// Player state constants
export const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};
