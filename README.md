# 📚 Vibe Audio - Sách Nói

Ứng dụng nghe sách nói online với giao diện hiện đại, sử dụng YouTube IFrame Player API.

## 🎯 Kiến trúc (v2.0)

```
User → React App (Vite) → YouTube IFrame Player API → YouTube Stream
```

**Không cần backend/proxy** - Sử dụng trực tiếp YouTube API cho cả tìm kiếm và phát nhạc.

## ✨ Tính năng

- 🔍 **Tìm kiếm thông minh** - Tự động thêm prefix "Sách nói" và lọc kết quả.
- 🎵 **YouTube IFrame Player** - Phát trực tiếp từ YouTube với giao diện tùy chỉnh.
- 🎛️ **Custom Controls** - Điều khiển: Play, Pause, Seek, Speed, Volume.
- � **Queue Management** - Quản lý danh sách phát, tự động lưu hàng chờ (Persistence).
- 📱 **PWA Support** - Cài đặt như ứng dụng native trên điện thoại, hỗ trợ chạy nền.
- 🎨 **Aesthetic Design** - Giao diện Soft Gold sang trọng, mượt mà.
- � **Local Data** - Lưu lịch sử, yêu thích và playlist vào IndexedDB.

## 🚀 Cài đặt Local

### Yêu cầu

- Node.js 18+
- YouTube Data API v3 key (xem [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md))

### Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd AudioBookReader

# Cài đặt dependencies
npm install

# Setup environment
cp .env.example .env
# Thêm YouTube API key của bạn vào VITE_YOUTUBE_API_KEY trong .env

# Chạy development server
npm run dev
```

## 📁 Cấu trúc Project

```
src/
├── components/
│   ├── common/          # Các thành phần dùng chung (Nav, BookCard,...)
│   ├── player/          # Trình phát (FullPlayer, MiniPlayer, Controls,...)
│   ├── search/          # Chức năng tìm kiếm
│   └── playlist/        # Quản lý danh sách phát
├── contexts/
│   ├── PlayerContext.jsx   # Context chính điều khiển trình phát (Hợp nhất)
│   ├── PlayerReducer.js    # Quản lý trạng thái phức tạp của Player
│   ├── PlaylistContext.jsx # Quản lý dữ liệu playlist người dùng
│   └── ToastContext.jsx    # Hệ thống thông báo
├── hooks/
│   ├── usePlayerQueue.js       # Logic hàng chờ & đồng bộ
│   ├── usePlayerPersistence.js # Tự động lưu trữ vào localStorage
│   ├── usePlayerBackground.js  # Media Session & Chạy nền
│   ├── useYouTubePlayerCore.js # Khởi tạo & xử lý YouTube API
│   └── useSearch.js            # Logic tìm kiếm & lọc
├── services/
│   ├── api.js           # Giao tiếp YouTube Data API
│   ├── youtube.js       # Quản lý IFrame Player Instance
│   └── db.js            # IndexedDB (Dexie)
├── utils/               # Helpers, Constants, Haptics
└── pages/               # Home, Library, Favorites, Radio
```

## � Tech Stack

- **React 18** + Vite
- **TailwindCSS** - Styling & Design System
- **YouTube IFrame Player API** - Video playback
- **YouTube Data API v3** - Search functionality
- **Dexie.js** - IndexedDB wrapper cho dữ liệu local
- **Lucide React** - Icons
- **Vite PWA Plugin** - Ứng dụng web tiến bộ

## � Deploy

Ứng dụng có thể được deploy dễ dàng lên **Vercel** hoặc **Netlify**.
Vì đây là ứng dụng Pure Client-side (v2.0), bạn chỉ cần cấu hình Environment Variables trên Web Dashboard của nhà cung cấp hosting.

## 👨‍� Author

**Phan Ngọc Tuấn**

## 📄 License

MIT License - Free to use and modify
