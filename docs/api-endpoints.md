# 🔌 API Endpoints Documentation

## Base URL

**Development**: `http://localhost:3000`  
**Production**: `https://your-app.railway.app`

---

## 📍 Endpoints

### 1. Health Check

**GET** `/health`

Kiểm tra server status.

**Response:**
```json
{
  "status": "ok"
}
```

**Example:**
```bash
curl http://localhost:3000/health
```

---

### 2. Search Audiobooks

**GET** `/api/search`

Tìm kiếm sách nói trên YouTube.

**Query Parameters:**
- `q` (required): Search query

**Response:**
```json
{
  "items": [
    {
      "url": "/watch?v=VIDEO_ID",
      "title": "Tên sách nói",
      "uploaderName": "Tên kênh",
      "thumbnail": "https://i.ytimg.com/...",
      "duration": "1:23:45",
      "views": 0,
      "uploadedDate": "2 months ago"
    }
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/search?q=Đắc%20Nhân%20Tâm"
```

**Frontend Usage:**
```javascript
const results = await fetch(`${PROXY_URL}/search?q=${encodeURIComponent(query)}`);
const data = await results.json();
```

---

### 3. Get Stream Info

**GET** `/api/streams/:videoId`

Lấy thông tin stream và metadata.

**Path Parameters:**
- `videoId` (required): YouTube video ID

**Response:**
```json
{
  "title": "Tên sách nói đầy đủ",
  "uploader": "Tên kênh",
  "thumbnailUrl": "https://i.ytimg.com/...",
  "duration": 4357,
  "audioStreams": [
    {
      "url": "/stream/VIDEO_ID",
      "mimeType": "audio/mp4",
      "bitrate": 128000
    }
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/streams/eKYMpbZ70Js"
```

**Frontend Usage:**
```javascript
const info = await fetch(`${PROXY_URL}/streams/${videoId}`);
const data = await info.json();
const streamUrl = `http://localhost:3000${data.audioStreams[0].url}`;
```

---

### 4. Stream Audio

**GET** `/stream/:videoId`

Download và serve audio file.

**Path Parameters:**
- `videoId` (required): YouTube video ID

**Response:**
- **Content-Type**: `audio/mp4`
- **Content-Length**: File size in bytes
- **Accept-Ranges**: `bytes`
- **Access-Control-Allow-Origin**: `*`

**Behavior:**
1. Check cache in `/tmp/audio-{videoId}-*.m4a`
2. If cached: Serve immediately
3. If not cached:
   - Download with yt-dlp
   - Save to `/tmp`
   - Serve file
4. Browser plays audio

**Example:**
```bash
# Download file
curl "http://localhost:3000/stream/eKYMpbZ70Js" -o audio.m4a

# Stream in browser
<audio src="http://localhost:3000/stream/eKYMpbZ70Js" />
```

**Frontend Usage:**
```javascript
audioRef.current.src = `http://localhost:3000/stream/${videoId}`;
audioRef.current.load();
await audioRef.current.play();
```

---

## 🔄 Request Flow

### Search Request
```
Client
  ↓ GET /api/search?q=query
Backend
  ↓ youtube-search-api.GetListByKeyword()
YouTube
  ↓ Return search results
Backend
  ↓ Transform data
Client
  ↓ Display results
```

### Stream Request
```
Client
  ↓ GET /stream/:videoId
Backend
  ↓ Check cache
  ├─ Cached? → Serve file
  └─ Not cached?
      ↓ yt-dlp download
      ↓ Save to /tmp
      ↓ Serve file
Client
  ↓ Play audio
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Missing query parameter"
}
```

### 404 Not Found
```json
{
  "error": "Video not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "yt-dlp download failed"
}
```

---

## 🎯 Rate Limits

**None** - No rate limiting implemented.

**Note**: YouTube may rate limit yt-dlp if too many requests.

---

## 🔒 CORS

**Allowed Origins**: `*` (all origins)

**Headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 📊 Performance

### Response Times
- `/health`: <10ms
- `/api/search`: 500ms - 2s
- `/api/streams/:id`: 3s - 10s (yt-dlp metadata)
- `/stream/:id`:
  - Cached: <100ms
  - Not cached: 30s - 60s (download)

### File Sizes
- Average: 15MB per hour
- Range: 10MB - 30MB per hour
- Format: M4A (AAC audio)

---

## 🧪 Testing

### Test Health
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

### Test Search
```bash
curl "http://localhost:3000/api/search?q=test"
# Expected: JSON with items array
```

### Test Stream Info
```bash
curl "http://localhost:3000/api/streams/eKYMpbZ70Js"
# Expected: JSON with title, audioStreams
```

### Test Stream Download
```bash
curl -I "http://localhost:3000/stream/eKYMpbZ70Js"
# Expected: 200 OK, Content-Type: audio/mp4
```

---

## 🔧 Backend Implementation

See `yt-proxy.js` for full implementation:

```javascript
// Search endpoint
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  const result = await YoutubeSearch.GetListByKeyword(q, false, 20);
  // Transform and return
});

// Stream endpoint
app.get('/stream/:videoId', async (req, res) => {
  // Check cache
  // Download if needed
  // Serve file
});
```
