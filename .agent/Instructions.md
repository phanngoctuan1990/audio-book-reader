## SECTION 0: CRITICAL GIT APPROVAL POLICY (QUY TẮC TỐI THƯỢNG)

**DỪNG LẠI! TRƯỚC KHI THỰC HIỆN BẤT KỲ LỆNH GIT NÀO:**

1. **COMMIT**: Tuyệt đối KHÔNG được `git commit` nếu chưa được USER xem qua code và nói "OK commit" hoặc "Approve".
2. **PUSH**: Tuyệt đối KHÔNG được `git push` nếu chưa được USER xác nhận rõ ràng bằng câu lệnh "Đẩy code lên main" hoặc tương đương.
3. **MỌI SAI PHẠM**: Sẽ làm mất lòng tin hoàn toàn của USER và là hành vi không thể chấp nhận được.

---

## SECTION 1: RULES & CONSTRAINTS (Hiến pháp dự án)

1. **Philosophy:** "Vibe Coding" - Code less, deliver value fast. Prioritize "One-thumb" interaction on mobile.
2. **Tech Stack:**
   - Framework: React + Vite
   - Styling: Tailwind CSS (Mobile-first)
   - Data Source: **YouTube Data API v3** + **YouTube IFrame Player API**
   - Database: IndexedDB (via `idb`) for metadata caching.
   - Player: YouTube IFrame Player API + Custom Controls.
3. **Architecture Constraints:**
   - **YouTube Compliant:** Use YouTube IFrame Player API for legal streaming.
   - **Client-Side Only:** No backend server required.
   - **Direct Streaming:** Stream from YouTube CDN, no proxy needed.
4. **Coding Style:**
   - Use Functional Components & Hooks.
   - Error Handling: Graceful degradation (Try multiple Piped instances if one fails).
   - Naming: `camelCase` for vars, `PascalCase` for components.

---

## SECTION 1.5: CODING CONVENTIONS & RULES

### File Naming

| Loại       | Convention                            | Ví dụ                             |
| ---------- | ------------------------------------- | --------------------------------- |
| Components | `PascalCase.jsx`                      | `SearchBar.jsx`, `MiniPlayer.jsx` |
| Hooks      | `camelCase.js` với prefix `use`       | `useAudio.js`, `useSearch.js`     |
| Contexts   | `PascalCase.jsx` với suffix `Context` | `PlayerContext.jsx`               |
| Services   | `camelCase.js`                        | `api.js`, `db.js`                 |
| Utils      | `camelCase.js`                        | `formatters.js`, `constants.js`   |
| Pages      | `PascalCase.jsx`                      | `Home.jsx`, `Library.jsx`         |

### Component Structure

```jsx
// 1. Imports (theo thứ tự)
import { useState, useEffect } from "react"; // React core
import { usePlayer } from "../contexts/..."; // Contexts
import { useSearch } from "../hooks/..."; // Hooks
import { formatTime } from "../utils/..."; // Utils
import ChildComponent from "./ChildComponent"; // Components

// 2. Component definition
function ComponentName({ prop1, prop2 }) {
  // 2.1 Hooks đầu tiên
  const [state, setState] = useState(null);
  const { data } = usePlayer();

  // 2.2 Effects
  useEffect(() => {
    // ...
  }, []);

  // 2.3 Handlers
  const handleClick = () => {
    // ...
  };

  // 2.4 Early returns (loading, error, empty)
  if (!data) return <Skeleton />;

  // 2.5 Main render
  return <div className="...">{/* JSX */}</div>;
}

// 3. Export
export default ComponentName;
```

### Tailwind CSS Conventions

```jsx
// ✅ Thứ tự classes: Layout → Spacing → Sizing → Colors → Effects → States
className="flex items-center gap-3 p-4 w-full bg-dark-800 rounded-xl shadow-lg hover:bg-dark-700 transition-colors"

// ✅ Responsive: Mobile-first
className="text-sm md:text-base lg:text-lg"

// ✅ Dùng template literals cho conditional classes
className={`base-class ${isActive ? 'active-class' : 'inactive-class'}`}

// ✅ Touch-friendly: Minimum 44x44px cho interactive elements
className="min-h-[44px] min-w-[44px]" // hoặc class "touch-target"

// ❌ KHÔNG inline styles trừ dynamic values
style={{ width: `${progress}%` }}  // OK - dynamic value
style={{ color: 'red' }}           // ❌ - dùng Tailwind class
```

### State Management Rules

```javascript
// ✅ Local state cho UI-only state
const [isOpen, setIsOpen] = useState(false);

// ✅ Context cho shared state (Player, Toast, Theme)
const { isPlaying, toggle } = usePlayer();

// ✅ localStorage cho user preferences
localStorage.setItem("playbackSpeed", speed);

// ✅ IndexedDB cho large data (audio blobs, history)
await saveAudiobook(data);

// ❌ KHÔNG dùng global state libraries (Redux, Zustand)
```

### Error Handling Pattern

```javascript
// ✅ Try-catch với user-friendly messages
try {
  const data = await fetchData();
} catch (error) {
  console.error("Fetch failed:", error);
  toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
}

// ✅ Loading & Error states
const [state, setState] = useState({
  data: null,
  isLoading: false,
  error: null,
});

// ✅ Fallback UI
if (error) return <ErrorState onRetry={refetch} />;
if (isLoading) return <Skeleton />;
if (!data) return <EmptyState />;
```

### Async/Await Pattern

```javascript
// ✅ Async functions trong useEffect
useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

// ✅ Cleanup cho async operations
useEffect(() => {
  let cancelled = false;

  fetchData().then((data) => {
    if (!cancelled) setData(data);
  });

  return () => {
    cancelled = true;
  };
}, []);
```

### Event Handler Naming

```javascript
// ✅ Prefix "handle" cho handlers
const handleClick = () => {};
const handleSubmit = () => {};
const handlePlayPause = () => {};

// ✅ Prefix "on" cho props
<Button onClick={handleClick} />
<SearchBar onSearch={handleSearch} />
```

### Comments & Documentation

```javascript
// ✅ JSDoc cho complex functions
/**
 * Fetch audio stream URL với fallback qua nhiều instances
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} Audio stream URL
 * @throws {Error} Nếu tất cả instances đều fail
 */
async function getStream(videoId) {}

// ✅ Comment cho logic phức tạp
// Ưu tiên m4a cho iOS compatibility, fallback sang webm
const audioStream =
  streams.find((s) => s.mimeType.includes("m4a")) ||
  streams.find((s) => s.mimeType.includes("webm"));

// ❌ KHÔNG comment obvious code
// Set loading to true
setLoading(true); // ❌ Không cần
```

### Import/Export Rules

```javascript
// ✅ Named exports cho utils, hooks
export function formatTime(seconds) {}
export function useAudio() {}

// ✅ Default export cho components
export default function Player() {}

// ✅ Barrel exports cho folders (index.js)
// components/common/index.js
export { default as Button } from "./Button";
export { default as Modal } from "./Modal";

// ❌ KHÔNG mix default và named trong cùng file
```

### Git Commit Convention

```
feat: Add sleep timer feature
fix: Fix audio not playing on iOS Safari
refactor: Simplify PlayerContext logic
style: Update button colors
docs: Add API documentation
chore: Update dependencies
```

---

## SECTION 2: YOUTUBE API INTEGRATION

**Primary API: YouTube Data API v3 + IFrame Player API**

```javascript
// YouTube Data API v3 for search
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

// YouTube IFrame Player API for playback
const YOUTUBE_IFRAME_API = "https://www.youtube.com/iframe_api";
```

**Integration Strategy:**

- **Search**: YouTube Data API v3 với API key
- **Playback**: YouTube IFrame Player API (tuân thủ ToS)
- **Controls**: Custom overlay controls trên IFrame
- **Caching**: Metadata caching với IndexedDB

---

## SECTION 3: SKILLS & CAPABILITIES (Kỹ năng cốt lõi)

**Skill 1: YouTube API Integration**

- **Search API**: YouTube Data API v3 với proper quota management
- **Player API**: YouTube IFrame Player API với custom controls
- **Search Logic**: Auto-prefix "Sách nói" cho audiobook search
- **Caching Strategy**: Metadata caching với IndexedDB
- **Error Handling**: Graceful fallback cho API failures

**Skill 2: YouTube Player & Controls**

- Use YouTube IFrame Player API với hidden controls
- **Custom Controls**: Overlay controls cho mobile-friendly UX
- **Media Session**: Integrate với lock screen controls
- **State Sync**: Sync YouTube player events với React state
- **Playback Speed**: Support 0.25x đến 2x với YouTube API

**Skill 3: Metadata Caching (IndexedDB)**

- Schema: `{ videoId, title, author, thumbnail, duration, savedAt, lastPlayedAt, lastPosition }`.
- **No Audio Blobs**: Chỉ cache metadata, stream trực tiếp từ YouTube
- **Resume Feature**: Lưu `lastPosition` mỗi 10 giây, tự động resume
- **Smart Caching**: LRU cache cho search results và video details

**Skill 4: User Data Management**

- **History:** Lưu lịch sử nghe với progress percentage.
- **Favorites:** Danh sách yêu thích với toggle heart.
- **Playlists:** Tạo và quản lý playlist tùy chỉnh.
- **Bookmarks:** Đánh dấu vị trí trong sách với ghi chú.

---

## SECTION 4: WORKFLOWS (Quy trình làm việc)

**Workflow 1: Implement Search (YouTube Data API v3)**

1. UI: Create `SearchBar` (Debounced 500ms).
2. Logic: Add prefix "Sách nói" to Vietnamese queries.
3. API: Call YouTube Data API v3 search endpoint -> Map to clean JSON.
4. Results: Show thumbnail + title + author + duration.
5. States: Loading skeleton, empty state, error state with retry.
6. Caching: Cache search results trong IndexedDB.

**Workflow 2: Build YouTube Player**

1. Hook: Create `useYouTubePlayer` custom hook với full controls.
2. Player: Initialize YouTube IFrame Player API.
3. Integration: Bind `navigator.mediaSession` metadata + handlers.
4. UI: Custom controls overlay + Seekbar + Speed control + Skip buttons.
5. Resume: Load lastPosition từ IndexedDB và seek đến vị trí đó.

**Workflow 3: Metadata Caching**

1. Cache: Save search results và video metadata to IndexedDB.
2. Storage: Chỉ cache metadata, không cache audio blobs.
3. Library: Hiển thị "Lịch sử" và "Yêu thích" từ cached data.
4. Playback: Resume từ lastPosition trong cache.
5. Management: LRU cleanup cho cache size management.

**Workflow 4: PWA Installation**

1. Manifest: Configure với icons, theme, splash screens.
2. iOS Meta: apple-mobile-web-app tags for Safari.
3. Install Prompt: Custom banner cho Android, guide modal cho iOS.
4. Service Worker: Cache shell + API responses.

**Workflow 5: Library Management**

1. History: Auto-save progress mỗi 10s với lastPosition.
2. Favorites: Heart toggle với animation.
3. Playlists: Create, add items, play queue.
4. Bookmarks: Mark position với optional notes.

---

## SECTION 5: PROJECT STRUCTURE

```
src/
├── components/
│   ├── search/
│   │   ├── SearchBar.jsx
│   │   └── SearchResults.jsx
│   ├── player/
│   │   ├── YouTubePlayer.jsx
│   │   └── MiniPlayer.jsx
│   ├── common/
│   │   ├── InstallBanner.jsx
│   │   └── BottomNav.jsx
├── hooks/
│   ├── useSearch.js
│   ├── useFavorites.js
│   └── useInstallPrompt.js
├── services/
│   ├── youtube.js       # YouTube API integration
│   ├── api.js           # API wrapper
│   └── db.js            # IndexedDB operations
├── contexts/
│   ├── YouTubePlayerContext.jsx
│   └── PlayerContext.jsx  # Re-export for compatibility
├── pages/
│   ├── Home.jsx         # Search
│   ├── Library.jsx      # History + Playlists
│   └── Favorites.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

**INSTRUCTION:**
Bạn hãy đóng vai trò theo Role đã định nghĩa.
Tham khảo chi tiết prompts trong thư mục `/prompts` để implement từng feature.

---

## PROMPTS ROADMAP (Updated for YouTube Integration)

| Prompt                             | Nội dung                                   | Workflow         |
| ---------------------------------- | ------------------------------------------ | ---------------- |
| **01-youtube-service.md**          | YouTube Service + IFrame Player API        | Core Integration |
| **02-youtube-player-context.md**   | YouTube Player Context + State Management  | Player Setup     |
| **03-youtube-player-component.md** | YouTube Player Component + Custom Controls | UI Layer         |
| **04-update-search-hook.md**       | Search Hook + YouTube Data API v3          | Search Feature   |
| **05-update-player-context.md**    | Player Context Integration                 | Compatibility    |
| **06-update-api-service.md**       | API Service Migration                      | API Layer        |
| **07-update-components.md**        | Component Updates                          | UI Updates       |
| **08-environment-config.md**       | Environment Setup + API Keys               | Configuration    |
| **09-testing-cleanup.md**          | Testing + Cleanup                          | Finalization     |

**Thứ tự thực hiện:** `01` → `02` → `03` → `04` → `05` → `06` → `07` → `08` → `09`
