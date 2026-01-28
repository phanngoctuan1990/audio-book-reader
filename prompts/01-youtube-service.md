# YouTube Service Integration v2.0

## 🎯 Objective
Create YouTube API service with modular architecture and centralized constants.

## 📋 Implementation

### 1. Create Constants File
```javascript
// src/utils/constants.js
export const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
export const YOUTUBE_IFRAME_API = "https://www.youtube.com/iframe_api";

export const PLAYER_CONFIG = {
  TIME_UPDATE_INTERVAL: 250,
  POSITION_SAVE_INTERVAL: 10000,
  SEEK_BACKWARD_SECONDS: 10,
  SEEK_FORWARD_SECONDS: 30,
  PROGRESS_FINISHED_THRESHOLD: 99,
  PLAYER_CONTAINER_ID: "youtube-player-container",
};

export const SEARCH_CONFIG = {
  PREFIX: "Sách nói",
  MAX_RESULTS: 30,
};

export const STORAGE_KEYS = {
  PLAYBACK_SPEED: "playbackSpeed",
  REPEAT_MODE: "repeatMode",
  LAST_TRACK: "lastTrack",
};
```

### 2. Create Formatters
```javascript
// src/utils/formatters.js
export function formatYouTubeDuration(duration) {
  if (!duration) return "0:00";
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

export function formatViewCount(count) {
  const num = parseInt(count);
  if (isNaN(num)) return "";

  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
  return `${num} views`;
}

export function calculateProgress(position, duration) {
  if (!duration || duration <= 0) return 0;
  return Math.min(Math.max(Math.round((position / duration) * 100), 0), 100);
}
```

### 3. Create Error Handler
```javascript
// src/utils/errors.js
export function parseYouTubeError(err) {
  const message = err.message?.toLowerCase() || "";

  if (message.includes("quota") || message.includes("exceeded")) {
    return "Đã vượt quá giới hạn tìm kiếm. Vui lòng thử lại sau.";
  }
  if (message.includes("api key") || message.includes("forbidden")) {
    return "Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra internet.";
  }
  return "Không thể kết nối tới YouTube. Vui lòng thử lại.";
}
```

### 4. Create YouTube Service
```javascript
// src/services/youtube.js
import { YOUTUBE_API_BASE, PLAYER_CONFIG, SEARCH_CONFIG } from "../utils/constants";
import { formatYouTubeDuration, formatViewCount } from "../utils/formatters";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
let player = null;
let isAPIReady = false;

export function loadYouTubeAPI() {
  // Load YouTube IFrame API
}

export async function createPlayer(containerId, onReady, onStateChange, onError) {
  await loadYouTubeAPI();
  // Create player with PLAYER_CONFIG constants
}

export async function searchVideos(query, maxResults = SEARCH_CONFIG.MAX_RESULTS, filters = {}) {
  const params = mapFiltersToParams(filters);
  const searchUrl = `${YOUTUBE_API_BASE}/search?${params}`;
  // Use helper functions
  return data.items.map(mapVideoItem);
}

// Helper functions
function mapFiltersToParams(filters) {
  const params = new URLSearchParams({
    part: 'snippet',
    q: `${SEARCH_CONFIG.PREFIX} ${query}`,
    type: 'video',
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY
  });
  // Add filter logic
  return params;
}

function mapVideoItem(item, details) {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    author: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium?.url,
    duration: formatYouTubeDuration(details?.contentDetails?.duration),
    views: formatViewCount(details?.statistics?.viewCount),
    uploadedDate: item.snippet.publishedAt,
    description: item.snippet.description
  };
}

// Player controls using constants
export function seekTo(seconds) {
  if (player?.seekTo) player.seekTo(seconds, true);
}

export const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};
```

## ✅ Key Changes from v1.0
- **Constants**: All magic numbers moved to `constants.js`
- **Formatters**: Reusable functions in `formatters.js`
- **Error Handling**: Centralized in `errors.js`
- **Helper Functions**: Search logic modularized
- **Configuration**: Environment-based settings
- `getDuration()` - Lấy tổng thời lượng

### Event Handlers
- `onPlayerReady` - Khi player sẵn sàng
- `onPlayerStateChange` - Khi trạng thái thay đổi
- `onPlayerError` - Khi có lỗi

## Lưu ý
- Sử dụng minimal code, chỉ essential functions
- Handle API key từ environment variables
- Error handling cơ bản
- Export các functions để sử dụng trong components
