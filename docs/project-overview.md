# 📚 AudioBook Reader - Project Overview

## 🎯 Mục đích
Ứng dụng web nghe sách nói online, tìm kiếm và phát audio từ YouTube với giao diện hiện đại.

## 🏗️ Kiến trúc

### Frontend (React + Vite)
```
Browser (localhost:5173)
  ↓
React App
  ↓
API Service (fetch)
  ↓
Backend Proxy (localhost:3000)
```

### Backend (Express + yt-dlp)
```
Express Server (port 3000)
  ↓
yt-dlp CLI
  ↓
YouTube
  ↓
Download → Cache → Serve
```

## 📁 Cấu trúc Source Code

```
AudioBookReader/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSkeleton.jsx    # Loading UI
│   │   │   └── ErrorBoundary.jsx      # Error handling
│   │   ├── home/
│   │   │   ├── Home.jsx               # Home page
│   │   │   └── SearchBar.jsx          # Search input
│   │   ├── player/
│   │   │   ├── MiniPlayer.jsx         # Bottom player
│   │   │   └── FullPlayer.jsx         # Full screen player
│   │   └── search/
│   │       └── SearchResults.jsx      # Search results list
│   ├── contexts/
│   │   └── PlayerContext.jsx          # Global player state
│   ├── services/
│   │   ├── api.js                     # API calls to backend
│   │   └── db.js                      # IndexedDB operations
│   ├── utils/
│   │   ├── constants.js               # App constants
│   │   └── formatters.js              # Format helpers
│   ├── App.jsx                        # Root component
│   └── main.jsx                       # Entry point
├── public/
│   ├── manifest.json                  # PWA manifest
│   └── icons/                         # App icons
├── yt-proxy.js                        # Backend server
├── package.json                       # Dependencies
├── vite.config.js                     # Build config
└── tailwind.config.js                 # Styling config
```

## 🔄 Data Flow

### 1. Search Flow
```
User types query
  ↓
SearchBar.jsx
  ↓
api.search(query)
  ↓
GET /api/search?q=query
  ↓
youtube-search-api
  ↓
Return 20 results
  ↓
SearchResults.jsx displays
```

### 2. Play Flow
```
User clicks result
  ↓
PlayerContext.loadTrack()
  ↓
api.getStream(videoId)
  ↓
GET /api/streams/:videoId
  ↓
yt-dlp -j (get metadata)
  ↓
Return stream info
  ↓
GET /stream/:videoId
  ↓
yt-dlp download to /tmp
  ↓
Serve file with proper headers
  ↓
Browser plays audio
```

### 3. Cache Flow
```
First play:
  Download (30-60s) → Cache in /tmp → Play

Second play:
  Check cache → Serve from /tmp → Play (instant)
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (fast HMR)
- **TailwindCSS** - Utility-first CSS
- **IndexedDB (idb)** - Local storage

### Backend
- **Express 5** - Web server
- **yt-dlp** - YouTube downloader (CLI)
- **youtube-search-api** - Search without API key
- **CORS** - Cross-origin support

### External Tools
- **yt-dlp** - Must be installed globally

## 🔑 Key Features

### 1. Smart Search
- Auto prefix "Sách nói"
- 20 results per search
- Display: title, author, duration, file size, views

### 2. Audio Player
- HTML5 Audio API
- Controls: play, pause, seek, speed
- Mini player (bottom bar)
- Full player (modal)
- Progress tracking

### 3. File Caching
- Location: `/tmp/audio-{videoId}-{timestamp}.m4a`
- Format: M4A (best compatibility)
- Auto cleanup on restart
- Cache check before download

### 4. Offline Support (Future)
- IndexedDB for metadata
- Service Worker for caching
- PWA installable

## 📊 Performance

### Metrics
- **Search**: <1s
- **First play**: 30-60s (download)
- **Cached play**: <1s
- **File size**: ~15MB/hour
- **Memory**: ~50MB (frontend)

### Optimization
- Lazy loading components
- Image lazy loading
- Debounced search
- File caching
- Minimal dependencies

## 🚀 Deployment

### Development
```bash
# Terminal 1: Backend
node yt-proxy.js

# Terminal 2: Frontend
npm run dev
```

### Production
```bash
# Backend: Railway
- Auto-detect Node.js
- Install yt-dlp automatically
- Serve on $PORT

# Frontend: Vercel
- Auto-detect Vite
- Build and deploy
- Update API URL
```

## 🔒 Security

- No API keys required
- No user authentication
- No data collection
- CORS enabled for localhost
- Files auto-deleted on restart

## 📝 Environment Variables

### Backend (yt-proxy.js)
```javascript
PORT=3000  // Optional, defaults to 3000
```

### Frontend (api.js)
```javascript
PROXY_URL='http://localhost:3000/api'  // Development
// PROXY_URL='https://your-app.railway.app/api'  // Production
```

## 🐛 Common Issues

### 1. yt-dlp not found
```bash
# Install yt-dlp
brew install yt-dlp  # macOS
```

### 2. Port 3000 in use
```bash
# Kill process
lsof -ti:3000 | xargs kill -9
```

### 3. Audio not playing
- Check Console for errors
- Clear cache: `rm /tmp/audio-*`
- Restart backend

### 4. CORS errors
- Ensure backend is running
- Check PROXY_URL in api.js
- Verify CORS headers

## 📚 API Documentation

See `api-endpoints.md` for detailed API docs.

## 🎨 UI/UX Guidelines

See `ui-guidelines.md` for design system.

## 🧪 Testing

See `testing-guide.md` for testing instructions.
