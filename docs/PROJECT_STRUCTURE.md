# 📁 Project Structure Guide v2.0

## 🎯 Overview
Complete file structure for AudioBookReader v2.0 with modular hook architecture.

## 🏗️ **v2.0 Architecture Highlights**
- **Modular Hooks**: Features separated into dedicated hooks
- **Context Splitting**: Performance optimization with state/actions separation  
- **Constants Centralized**: All config in `constants.js`
- **65% Code Reduction**: Main context reduced from 640 → 223 lines

## 📂 Root Structure
```
AudioBookReader/
├── 📁 public/                    # Static assets & PWA
│   ├── 📁 icons/                 # Complete PWA icon set
│   │   ├── icon-72x72.png → icon-512x512.png
│   │   ├── apple-touch-icon.png
│   │   └── search-96x96.png, library-96x96.png, heart-96x96.png
│   ├── manifest.json             # PWA manifest with shortcuts
│   └── sw.js                     # Service worker
├── 📁 src/                       # Source code (v2.0 architecture)
├── 📁 docs/                      # Documentation (updated)
├── 📁 prompts/                   # Implementation prompts (v2.0)
├── 📄 package.json               # Dependencies
├── 📄 vite.config.js            # Build configuration
├── 📄 tailwind.config.js        # Soft Gold theme
└── 📄 .env                      # Environment variables
```

## 📂 **Source Structure (v2.0)**
```
src/
├── 📁 components/               # UI Components
│   ├── 📁 common/              # Shared components
│   │   ├── BookCard.jsx        # 3D book cards
│   │   ├── BottomNav.jsx       # 4-tab navigation
│   │   └── EmptyState.jsx      # Empty state component
│   ├── 📁 player/              # Player components
│   │   ├── EnhancedMiniPlayer.jsx    # Enhanced mini player
│   │   ├── FullPlayerView.jsx        # Full player view
│   │   ├── ProgressBar.jsx           # Interactive progress bar
│   │   ├── TrackInfo.jsx             # Track information
│   │   ├── PlayingAnimation.jsx      # Bouncing bars animation
│   │   └── BackgroundPlaybackInfo.jsx # User education modal
│   └── 📁 radio/               # Radio components
├── 📁 contexts/                # React Contexts (v2.0)
│   ├── PlayerContext.jsx # Main player context (223 lines)
│   ├── PlayerReducer.js        # State management
│   ├── PlayerContext.jsx       # Legacy wrapper
│   ├── RadioContext.jsx        # Radio context
│   └── PlaylistContext.jsx     # Playlist context
├── 📁 hooks/                   # Custom Hooks (v2.0 Modular)
│   ├── useYouTubePlayerCore.js # Player instance & events
│   ├── usePlayerQueue.js       # Queue, shuffle, repeat
│   ├── usePlayerPersistence.js # localStorage sync
│   ├── usePlayerBackground.js  # Media session, wake lock
│   └── useSearch.js           # Search functionality
├── 📁 services/               # Business Logic
│   ├── youtube.js             # YouTube API (with helpers)
│   ├── db.js                  # IndexedDB operations
│   ├── mediaSession.js        # Lock screen controls
│   ├── backgroundPlayback.js  # Background manager
│   └── wakeLock.js           # Power management
├── 📁 utils/                  # Utilities (v2.0)
│   ├── constants.js           # ALL app constants (NO magic numbers)
│   ├── formatters.js          # Data formatting functions
│   └── errors.js              # Error handling utilities
├── 📁 pages/                  # Page Components
│   ├── Home.jsx               # Home page with tabs
│   ├── Radio.jsx              # Radio streaming
│   ├── Library.jsx            # Library with InProgress tab
│   └── Favorites.jsx          # Favorites page
└── 📄 main.jsx                # App entry point
```

## 🎯 **Key v2.0 Changes**

### **Modular Hooks Architecture**
```javascript
// Before: Monolithic context (640 lines)
PlayerContext.jsx - Everything in one file

// After: Modular hooks (223 lines main + focused hooks)
├── useYouTubePlayerCore.js    # Player instance
├── usePlayerQueue.js          # Queue management  
├── usePlayerPersistence.js    # Storage sync
└── usePlayerBackground.js     # Background features
```

### **Constants Centralization**
```javascript
// Before: Magic numbers everywhere
setInterval(updateTime, 250);
if (progress > 99) { /* finished */ }

// After: Centralized constants
import { PLAYER_CONFIG } from "../utils/constants";
setInterval(updateTime, PLAYER_CONFIG.TIME_UPDATE_INTERVAL);
if (progress > PLAYER_CONFIG.PROGRESS_FINISHED_THRESHOLD) { /* finished */ }
```

### **Context Splitting for Performance**
```javascript
// Before: Single context (re-renders on every state change)
const { currentTrack, play, currentTime } = usePlayer();

// After: Split contexts (optimized re-renders)
const { currentTrack, currentTime } = useContext(PlayerStateContext); // State
const { play } = useContext(PlayerActionsContext); // Actions (stable)
```

## 📊 **Architecture Benefits**
- ✅ **65% code reduction** in main context
- ✅ **Performance optimized** with context splitting
- ✅ **Independently testable** hooks
- ✅ **Easy feature additions** with hook composition
- ✅ **Zero magic numbers** with constants centralization

---

**Project structure optimized for v2.0 modular architecture** 🏆
└── 📄 README.md                 # Project overview
```

## 📁 Source Code Structure (`src/`)

### 🧩 Components (`src/components/`)
```
components/
├── 📁 search/                    # Search functionality
│   ├── SearchBar.jsx            # Search input with debounce
│   └── SearchResults.jsx        # Results display with grid/list view
├── 📁 player/                    # Player components
│   ├── YouTubePlayer.jsx        # Self-contained YouTube IFrame player
│   ├── FullPlayerView.jsx       # Full-screen player interface
│   └── MiniPlayer.jsx           # Compact player for bottom bar
├── 📁 common/                    # Shared components
│   ├── BottomNav.jsx            # Bottom navigation bar
│   ├── InstallBanner.jsx        # PWA install prompt
│   └── LoadingSpinner.jsx       # Loading indicator
└── 📁 pwa/                      # PWA specific components
    └── InstallBanner.jsx        # Install app banner
```

### 🔄 Contexts (`src/contexts/`)
```
contexts/
├── PlayerContext.jsx     # YouTube player state management
├── PlayerContext.jsx            # Re-export for backward compatibility
└── ToastContext.jsx            # Toast notifications
```

### 🛠️ Services (`src/services/`)
```
services/
├── youtube.js                   # YouTube API integration
│   ├── loadYouTubeAPI()        # Load IFrame Player API
│   ├── createPlayer()          # Create player instance
│   ├── searchVideos()          # Search via Data API v3
│   └── Player controls         # play, pause, seek, volume
├── api.js                      # API wrapper layer
│   ├── search()                # Search with "Sách nói" prefix
│   ├── getStream()             # Get YouTube embed URL
│   └── getDetails()            # Get video metadata
└── db.js                       # IndexedDB operations
    ├── saveAudiobook()         # Save metadata
    ├── getAudiobook()          # Get cached data
    ├── updatePlayPosition()    # Save progress
    └── addToHistory()          # Add to history
```

### 🎣 Hooks (`src/hooks/`)
```
hooks/
├── useSearch.js                # Search with debounce
├── useInstallPrompt.js         # PWA install detection
└── useFavorites.js            # Favorites management
```

### 📄 Pages (`src/pages/`)
```
pages/
├── Home.jsx                    # Search & discovery page
├── Library.jsx                 # History & playlists
├── Favorites.jsx               # Favorite tracks
└── Downloads.jsx               # Offline content (future)
```

### 🔧 Utils (`src/utils/`)
```
utils/
├── formatters.js               # Time, size, number formatting
├── constants.js                # App constants & config
└── helpers.js                  # Utility functions
```

## 📚 Documentation (`docs/`)
```
docs/
├── IMPLEMENTATION_GUIDE.md     # Master implementation guide
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
├── YOUTUBE_API_SETUP.md        # YouTube API configuration
└── PROJECT_STRUCTURE.md        # This file
```

## 🎯 Implementation Prompts (`prompts/`)

### Core Implementation (Essential)
```
prompts/
├── README.md                   # Execution overview
├── 01-youtube-service.md       # YouTube API integration
├── 02-youtube-player-context.md # Player state management
├── 03-youtube-player-component.md # Player UI components
├── 04-update-search-hook.md    # Search integration
├── 05-update-player-context.md # Backward compatibility
├── 06-update-api-service.md    # API layer updates
├── 07-update-components.md     # Component updates
├── 08-environment-config.md    # Environment setup
└── 09-testing-cleanup.md       # Testing & cleanup
```

### Enhanced Features (Optional)
```
prompts/features/
├── README.md                   # Features overview
├── 01-radio-streaming.md       # Radio mode
├── 02-playlist-management.md   # Advanced playlists
├── 03-advanced-player-controls.md # Repeat, visualizer
├── 04-enhanced-search.md       # URL paste, filters
├── 05-tab-navigation.md        # YouTube/Radio tabs
└── 06-enhanced-now-playing.md  # Rich player display
```

## 🔧 Configuration Files

### `package.json` - Dependencies
```json
{
  "name": "audiobook-reader",
  "version": "2.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "idb": "^8.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "vite-plugin-pwa": "^0.17.4"
  }
}
```

### `vite.config.js` - Build Configuration
```javascript
export default defineConfig({
  plugins: [react(), VitePWA({...})],
  build: { minify: 'terser' },
  server: { host: true, port: 5173 }
});
```

### `tailwind.config.js` - Styling
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'dark-900': '#0f0f1a',
        'dark-800': '#1a1a2e'
      }
    }
  }
};
```

## 🎨 Component Architecture

### State Flow
```
App.jsx
├── PlayerProvider (PlayerContext)
├── ToastProvider
├── Pages (Home, Library, Favorites)
├── MiniPlayer (when playing)
└── BottomNav
```

### Data Flow
```
User Input → useSearch → api.js → youtube.js → YouTube API
YouTube Player ← PlayerContext ← Components
```

### Event Flow
```
YouTube Player Events → PlayerContext → Components
User Actions → Components → Context → YouTube Service
```

## 📱 Mobile-First Design

### Breakpoints
```css
/* Mobile first */
.component { /* 375px+ */ }

@media (min-width: 768px) {
  .component { /* Tablet */ }
}

@media (min-width: 1024px) {
  .component { /* Desktop */ }
}
```

### Touch Targets
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

## 🔄 State Management

### Context Structure
```javascript
// PlayerContext
{
  currentTrack: Track | null,
  isPlaying: boolean,
  currentTime: number,
  duration: number,
  queue: Track[],
  queueIndex: number,
  // ... methods
}
```

### Local Storage
```javascript
// Persisted data
localStorage: {
  playbackSpeed: number,
  volume: number,
  theme: string
}
```

### IndexedDB Schema
```javascript
// Cached metadata
audiobooks: {
  videoId: string,
  title: string,
  author: string,
  thumbnail: string,
  lastPosition: number,
  savedAt: Date
}
```

## 🚀 Build Process

### Development
```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run preview # Preview build
```

### Production Optimizations
- Code splitting by route
- YouTube API caching
- Image optimization
- PWA service worker
- Minification & compression

## 📊 Performance Targets

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Bundle Size
- **Initial**: < 200KB gzipped
- **Total**: < 500KB gzipped
- **Chunks**: Lazy-loaded by route

## 🔒 Security Considerations

### API Key Protection
```javascript
// Restrict in Google Cloud Console
- HTTP referrers: yourdomain.com/*
- API restrictions: YouTube Data API v3 only
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://www.youtube.com;
               frame-src https://www.youtube.com;">
```

---

**🎯 This structure ensures scalability, maintainability, and performance while keeping the codebase clean and organized.**
