/**
 * YouTube Service - IFrame Player API & Data API v3 Integration
 * Minimal implementation for audiobook streaming
 */

import {
  YOUTUBE_API_BASE,
  YOUTUBE_IFRAME_API,
  PLAYER_CONFIG,
  SEARCH_MAX_RESULTS,
} from "../utils/constants";
import { formatYouTubeDuration, formatViewCount } from "../utils/formatters";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

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
 * Play video with retry mechanism for background playback
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<boolean>} - Whether play was successful
 */
export async function playVideo(retries = 3) {
  if (!player?.playVideo) return false;

  for (let i = 0; i < retries; i++) {
    try {
      player.playVideo();

      // Wait a bit and check if it actually started playing
      await new Promise((resolve) => setTimeout(resolve, 100));

      const state = player.getPlayerState?.();
      if (state === PlayerState.PLAYING || state === PlayerState.BUFFERING) {
        return true;
      }
    } catch (e) {
      // Retry on next iteration
    }

    // Wait before retry
    if (i < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  // Final attempt without checking
  if (player?.playVideo) {
    player.playVideo();
  }

  return false;
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
// YouTube Data API v3 Helpers (Phase 2 Refactor)
// =============================================================================

/**
 * Helper to map custom filters to YouTube API parameters
 */
function mapFiltersToParams(params, filters) {
  if (filters.sortBy && filters.sortBy !== "relevance") {
    params.append("order", filters.sortBy);
  }

  if (filters.duration && filters.duration !== "all") {
    if (filters.duration !== "short") {
      params.append("videoDuration", "long");
    }
  }

  if (filters.uploadDate && filters.uploadDate !== "all") {
    const now = new Date();
    let publishedAfter;

    switch (filters.uploadDate) {
      case "today":
        publishedAfter = new Date(now.setDate(now.getDate() - 1));
        break;
      case "week":
        publishedAfter = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        publishedAfter = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        publishedAfter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    if (publishedAfter) {
      params.append("publishedAfter", publishedAfter.toISOString());
    }
  }
}

/**
 * Helper to map YouTube API response to AudioBookReader format
 */
function mapVideoItem(item, details = []) {
  const detail = details.find(
    (d) => d.id === item.id.videoId || d.id === item.id,
  );
  const snippet = item.snippet;

  return {
    videoId: item.id.videoId || item.id,
    title: snippet.title,
    author: snippet.channelTitle,
    thumbnail:
      snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
    duration: detail?.duration || "",
    views: detail?.viewCount || "",
    uploadedDate: snippet.publishedAt,
    description: snippet.description,
  };
}

// =============================================================================
// YouTube Data API v3
// =============================================================================

/**
 * Search videos via YouTube Data API v3
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} Search results
 */
export async function searchVideos(
  query,
  maxResults = SEARCH_MAX_RESULTS,
  filters = {},
) {
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

  mapFiltersToParams(params, filters);

  try {
    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Search failed");
    }

    const data = await response.json();
    const videoIds = data.items.map((item) => item.id.videoId).join(",");
    const details = await getVideosDetails(videoIds);

    return data.items.map((item) => mapVideoItem(item, details));
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
      duration: formatYouTubeDuration(item.contentDetails.duration),
      viewCount: formatViewCount(item.statistics.viewCount),
      description: item.snippet.description,
    }));
  } catch (error) {
    return [];
  }
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
