# Prompt 6: Update API Service

## Mục tiêu
Sửa file `src/services/api.js` để loại bỏ proxy dependencies và sử dụng YouTube Data API trực tiếp.

## Yêu cầu
Update file `src/services/api.js`:

### Remove Proxy Dependencies
- Remove `PROXY_URL` constant
- Remove all proxy-based API calls
- Remove backend-dependent functions

### Add YouTube Data API Functions
- `search(query, addPrefix)` - YouTube Data API v3 search
- `getVideoDetails(videoId)` - Get video metadata
- `getStreamUrl(videoId)` - Return YouTube embed URL

### Update Existing Functions
```javascript
// Update search function
export async function search(query, addPrefix = true) {
  // Use YouTube Data API v3
  // Add "Sách nói" prefix if addPrefix is true
  // Return formatted results
}

// Update getStream function  
export async function getStream(videoId) {
  // Return YouTube embed URL instead of direct stream
  // Format: https://www.youtube.com/embed/{videoId}
  // Include metadata from YouTube API
}

// Update getDetails function
export async function getDetails(videoId) {
  // Use YouTube Data API v3 videos endpoint
  // Return video details
}
```

### Response Format
Maintain existing response format để compatibility:
```javascript
// Search response
{
  videoId, title, author, thumbnail, 
  duration, views, uploadedDate
}

// Stream response  
{
  url: "https://www.youtube.com/embed/{videoId}",
  mimeType: "video/mp4",
  title, author, thumbnail, duration
}
```

## Lưu ý
- Minimal code, essential functions only
- Handle YouTube API key từ environment
- Maintain existing function signatures
- Add basic error handling
