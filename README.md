# 📚 AudioBook Reader

Ứng dụng nghe sách nói online với giao diện hiện đại, sử dụng YouTube IFrame Player API.

## 🎯 Kiến trúc mới (v2.0)

```
User → React App → YouTube IFrame Player API → YouTube Stream
```

**Không cần backend/proxy** - Sử dụng trực tiếp YouTube API.

## 🔄 Luồng hoạt động

### 1️⃣ Tìm kiếm sách nói
```
User nhập từ khóa "Đắc Nhân Tâm"
  ↓
Frontend tự động thêm prefix → "Sách nói Đắc Nhân Tâm"
  ↓
Gọi YouTube Data API v3 (search endpoint)
  ↓
Trả về kết quả với: title, author, thumbnail, duration, views
  ↓
Frontend hiển thị danh sách
```

### 2️⃣ Phát audio
```
User click vào kết quả
  ↓
YouTube IFrame Player load video
  ↓
Custom controls overlay hiển thị
  ↓
Phát audio trực tiếp từ YouTube
```

### 3️⃣ Điều khiển phát
```
User tương tác với player
  ├─ Play/Pause → YouTube Player API
  ├─ Seek → player.seekTo(seconds)
  ├─ Speed → player.setPlaybackRate(rate)
  └─ Volume → player.setVolume(level)
```

## ✨ Tính năng

- 🔍 **Tìm kiếm thông minh** - Tự động thêm prefix "Sách nói"
- 🎵 **YouTube IFrame Player** - Phát trực tiếp từ YouTube
- 🎛️ **Custom Controls** - Giao diện điều khiển riêng
- 📱 **Responsive design** - Hoạt động mượt trên mọi thiết bị
- ⚡ **PWA support** - Cài đặt như app native
- 🎨 **Dark mode** - Giao diện tối đẹp mắt
- ⏯️ **Player controls** - Play, pause, seek, speed control
- 📋 **Queue management** - Quản lý danh sách phát

## 🚀 Cài đặt Local

### Yêu cầu
- Node.js 18+
- YouTube Data API v3 key (xem [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md))

### Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd AudioBookReader

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Thêm YouTube API key vào .env

# Run development server
npm run dev
```

### Environment Variables

```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_APP_NAME=AudioBookReader
```

## 📁 Cấu trúc Project

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── player/          # Player components
│   │   ├── MiniPlayer.jsx
│   │   └── YouTubePlayer.jsx
│   └── search/          # Search components
├── contexts/
│   ├── PlayerContext.jsx
│   ├── YouTubePlayerContext.jsx
│   └── ToastContext.jsx
├── hooks/
│   └── useSearch.js
├── pages/
├── services/
│   ├── api.js           # API service
│   ├── youtube.js       # YouTube API service
│   └── db.js            # IndexedDB
└── utils/
```

## 🔧 Tech Stack

- **React 18** + Vite
- **TailwindCSS** - Styling
- **YouTube IFrame Player API** - Video playback
- **YouTube Data API v3** - Search
- **IndexedDB** - Local storage

- Node.js 18+
- npm hoặc yarn
- yt-dlp

### 1. Clone project

```bash
git clone <repo-url>
cd AudioBookReader
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Cài yt-dlp

```bash
# macOS
brew install yt-dlp

# Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Windows
winget install yt-dlp
```

### 4. Chạy backend

```bash
node yt-proxy.js
# Backend chạy trên http://localhost:3000
```

### 5. Chạy frontend (terminal mới)

```bash
npm run dev
# Frontend chạy trên http://localhost:5173
```

### 6. Mở trình duyệt

```
http://localhost:5173
```

## 📁 Cấu trúc Project

```
AudioBookReader/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── home/            # Home page components
│   │   ├── player/          # Audio player components
│   │   └── search/          # Search components
│   ├── contexts/
│   │   └── PlayerContext.jsx  # Audio player state
│   ├── services/
│   │   ├── api.js           # API calls
│   │   └── db.js            # IndexedDB
│   ├── utils/
│   │   ├── constants.js     # App constants
│   │   └── formatters.js    # Format helpers
│   ├── App.jsx
│   └── main.jsx
├── public/                  # Static assets
├── yt-proxy.js             # Backend proxy server
├── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **IndexedDB** - Local storage

### Backend
- **Express** - Web server
- **yt-dlp** - YouTube downloader
- **youtube-search-api** - Search API

## 📝 API Endpoints

### Search
```
GET /api/search?q={query}
Response: { items: [...] }
```

### Get Stream Info
```
GET /api/streams/:videoId
Response: { title, uploader, audioStreams: [...] }
```

### Stream Audio
```
GET /stream/:videoId
Response: Audio file (M4A)
```

## 🚢 Deploy Production

### Backend (Railway)

1. **Tạo tài khoản Railway**
   - https://railway.app

2. **Deploy từ GitHub**
   ```bash
   # Push code lên GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Connect Railway**
   - New Project → Deploy from GitHub
   - Chọn repo
   - Railway tự động detect và deploy

4. **Cấu hình**
   - Không cần environment variables
   - Railway tự động cài yt-dlp

5. **Lấy URL**
   - Copy URL: `https://your-app.railway.app`

### Frontend (Vercel)

1. **Update API URL**
   ```javascript
   // src/services/api.js
   const PROXY_URL = 'https://your-app.railway.app/api';
   ```

2. **Deploy**
   ```bash
   git add .
   git commit -m "Update API URL"
   git push origin main
   ```

3. **Connect Vercel**
   - https://vercel.com
   - Import from GitHub
   - Deploy tự động

## ⚙️ Configuration

### Backend Port
```javascript
// yt-proxy.js
const PORT = process.env.PORT || 3000;
```

### Frontend API URL
```javascript
// src/services/api.js
const PROXY_URL = 'http://localhost:3000/api'; // Local
// const PROXY_URL = 'https://your-app.railway.app/api'; // Production
```

### Cache Location
```javascript
// yt-proxy.js
const tempFile = join(tmpdir(), `audio-${videoId}-${Date.now()}.m4a`);
// macOS: /var/folders/.../T/
// Linux: /tmp/
```

## 🐛 Troubleshooting

### Backend không chạy
```bash
# Kiểm tra yt-dlp
yt-dlp --version

# Kiểm tra port
lsof -i :3000

# Xem logs
node yt-proxy.js
```

### Frontend không kết nối backend
```bash
# Test backend
curl http://localhost:3000/health

# Kiểm tra CORS
# Mở DevTools → Network → Check headers
```

### Audio không phát
- Kiểm tra Console (F12) xem lỗi
- Xóa cache: Xem phần "Xóa Cache" bên dưới
- Restart backend

### Xóa Cache Files

Cache files được lưu trong thư mục temp của hệ thống:

**macOS/Linux:**
```bash
# Xem cache files
ls -lh /tmp/audio-* 2>/dev/null || \
ls -lh /var/folders/*/T/audio-* 2>/dev/null

# Xóa tất cả cache
rm -f /tmp/audio-* 2>/dev/null
rm -f /var/folders/*/T/audio-* 2>/dev/null

# Xóa cache cũ hơn 1 ngày
find /tmp -name "audio-*" -mtime +1 -delete 2>/dev/null
```

**Windows:**
```cmd
# Xem cache files
dir %TEMP%\audio-*

# Xóa cache
del %TEMP%\audio-*
```

**Xóa cache từ code:**
```javascript
// Thêm vào yt-proxy.js
import { readdirSync, unlinkSync } from 'fs';

function clearCache() {
  const files = readdirSync(tmpdir()).filter(f => f.startsWith('audio-'));
  files.forEach(f => unlinkSync(join(tmpdir(), f)));
  console.log(`Cleared ${files.length} cache files`);
}
```

## 📊 Performance

- **Search**: <1s
- **First play**: 30-60s (download)
- **Cached play**: <1s
- **File size**: ~15MB/hour
- **Bandwidth**: Railway free tier 100GB/month

## 🔒 Security

- Không lưu credentials
- Không track users
- Cache local only
- CORS enabled

## 📄 License

MIT License - Free to use and modify

## 👨‍💻 Author

Tuan Ngoc

## 🙏 Credits

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube downloader
- [youtube-search-api](https://www.npmjs.com/package/youtube-search-api) - Search API
- [React](https://react.dev) - UI framework
- [TailwindCSS](https://tailwindcss.com) - Styling
