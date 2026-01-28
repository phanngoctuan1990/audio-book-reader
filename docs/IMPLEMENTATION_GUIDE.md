# 🎵 AudioBookReader v2.0 - Implementation Guide

## 📋 Project Overview

**AudioBookReader v2.0** là một Progressive Web App (PWA) để nghe sách nói từ YouTube với kiến trúc modular hooks và performance tối ưu.

## 🏗️ **v2.0 Architecture Highlights**
- ✅ **Modular Hook Architecture** - 65% code reduction
- ✅ **Context Splitting** - Performance optimization  
- ✅ **Constants Centralized** - No magic numbers
- ✅ **Background Audio** - Lock screen controls
- ✅ **PWA Complete** - Offline support, shortcuts

### 🎯 Core Features
- ✅ Search sách nói trên YouTube với constants
- ✅ YouTube Player với modular hooks
- ✅ Queue management với dedicated hook
- ✅ Progress tracking với auto-persistence
- ✅ Background playback với Media Session API
- ✅ PWA với complete icon set và shortcuts
- ✅ Soft Gold theme với accessibility

### 🔧 Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (Soft Gold theme)
- **Player**: YouTube IFrame Player API
- **Search**: YouTube Data API v3  
- **Storage**: IndexedDB + localStorage (auto-sync)
- **PWA**: Service Worker + Manifest
- **Architecture**: Modular hooks + Context splitting

## 🚀 **Quick Start**

### 1. Environment Setup
```bash
# Clone repository
git clone <repo-url>
cd AudioBookReader

# Install dependencies  
npm install

# Setup environment
cp .env.example .env
# Add your YouTube API key to .env
```

### 2. YouTube API Setup
Follow **[YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)** for complete API configuration.

### 3. Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ **v2.0 Architecture Overview**

### **Modular Hook System**
```javascript
// Main Context (223 lines - 65% reduction)
PlayerContext.jsx
├── useYouTubePlayerCore.js    # Player instance & events
├── usePlayerQueue.js          # Queue, shuffle, repeat  
├── usePlayerPersistence.js    # Auto localStorage sync
└── usePlayerBackground.js     # Media session, wake lock
```

### **Performance Optimization**
```javascript
// Context splitting prevents unnecessary re-renders
const { currentTrack } = useContext(PlayerStateContext); // State
const { play } = useContext(PlayerActionsContext); // Actions (stable)
```

### **Constants Management**
```javascript
// All configuration centralized
import { PLAYER_CONFIG, STORAGE_KEYS } from "../utils/constants";
```

## 📱 **PWA Features**
- **Complete Icon Set**: 72x72 → 512x512 + shortcuts
- **Service Worker**: Caching + background sync
- **Manifest**: Shortcuts for quick access
- **Background Audio**: Lock screen controls
- **Offline Support**: Metadata caching

## 🎨 **UI/UX Features**
- **Soft Gold Theme**: Accessible color palette
- **Context Splitting**: Optimized re-renders
- **Touch-Friendly**: 44px minimum touch targets
- **Responsive**: Mobile-first design
- **Animations**: 60fps CSS transforms

## 📊 **Performance Benefits**
- **65% Code Reduction**: 640 → 223 lines in main context
- **Render Optimization**: Context splitting prevents unnecessary updates
- **Memory Efficiency**: Proper cleanup in modular hooks
- **Bundle Optimization**: Tree-shaking with modular structure

## 🧪 **Testing Strategy**
- **Hook Testing**: Each hook independently testable
- **Integration Testing**: Context interactions
- **Performance Testing**: Render count monitoring
- **PWA Testing**: Offline functionality

## 🚀 **Deployment**
Follow **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for hosting setup.

---

**Complete implementation guide for v2.0 modular architecture** 🏆
- **PWA**: Vite PWA plugin

### 🏗️ Architecture
```
React App → YouTube Data API v3 (search) → YouTube IFrame Player (playback)
```

---

## 🚀 Implementation Steps

### Phase 1: Core YouTube Integration (Essential)
Execute these prompts in order:

1. **[01-youtube-service.md](./01-youtube-service.md)** - YouTube Service & API integration
2. **[02-youtube-player-context.md](./02-youtube-player-context.md)** - Player state management
3. **[03-youtube-player-component.md](./03-youtube-player-component.md)** - Player UI components
4. **[04-update-search-hook.md](./04-update-search-hook.md)** - Search integration
5. **[05-update-player-context.md](./05-update-player-context.md)** - Backward compatibility
6. **[06-update-api-service.md](./06-update-api-service.md)** - API layer updates
7. **[07-update-components.md](./07-update-components.md)** - Component updates
8. **[08-environment-config.md](./08-environment-config.md)** - Environment setup
9. **[09-testing-cleanup.md](./09-testing-cleanup.md)** - Testing & cleanup

### Phase 2: Enhanced Features (Optional)
Choose features to implement from `/features/`:

- **[Radio Streaming](./features/01-radio-streaming.md)** - Add radio mode like Music-CLI
- **[Advanced Playlist](./features/02-playlist-management.md)** - Enhanced playlist features
- **[Player Controls](./features/03-advanced-player-controls.md)** - Repeat modes, visualizer
- **[Enhanced Search](./features/04-enhanced-search.md)** - URL paste, grid view
- **[Tab Navigation](./features/05-tab-navigation.md)** - YouTube/Radio tabs
- **[Now Playing](./features/06-enhanced-now-playing.md)** - Enhanced player display

---

## 📁 Project Structure

```
src/
├── components/
│   ├── search/
│   │   ├── SearchBar.jsx
│   │   └── SearchResults.jsx
│   ├── player/
│   │   ├── YouTubePlayer.jsx      # Self-contained YouTube player
│   │   ├── FullPlayerView.jsx     # Full-screen player UI
│   │   └── MiniPlayer.jsx         # Mini player
│   └── common/
│       ├── BottomNav.jsx
│       └── InstallBanner.jsx
├── contexts/
│   ├── PlayerContext.jsx   # YouTube player state
│   └── PlayerContext.jsx          # Re-export for compatibility
├── services/
│   ├── youtube.js                 # YouTube API integration
│   ├── api.js                     # API wrapper
│   └── db.js                      # IndexedDB operations
├── hooks/
│   └── useSearch.js               # Search functionality
├── pages/
│   ├── Home.jsx                   # Search page
│   ├── Library.jsx                # History & playlists
│   └── Favorites.jsx              # Favorites
└── utils/
    ├── formatters.js              # Time, size formatting
    └── constants.js               # App constants
```

---

## 🔑 Environment Setup

### Required Environment Variables
```env
# .env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_APP_NAME=AudioBookReader
VITE_APP_VERSION=2.0.0
```

### YouTube API Setup
1. Create Google Cloud Project
2. Enable YouTube Data API v3
3. Create API Key with restrictions:
   - API restrictions: YouTube Data API v3 only
   - HTTP referrers: your-domain.com/*

**Detailed setup**: [docs/YOUTUBE_API_SETUP.md](../docs/YOUTUBE_API_SETUP.md)

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "idb": "^8.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.4",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### Installation
```bash
npm install
npm run dev  # Development server
npm run build  # Production build
```

---

## 🎨 Design System

### Color Palette
```css
/* Dark theme primary */
--dark-900: #0f0f1a;
--dark-800: #1a1a2e;
--dark-700: #16213e;

/* Gradient primary */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Component Guidelines
- **Mobile-first**: Design for 375px width minimum
- **Touch-friendly**: 44px minimum touch targets
- **Dark theme**: Default and primary theme
- **Responsive**: Breakpoints at 768px, 1024px

---

## 🔧 Key Implementation Notes

### YouTube Integration
```javascript
// Use YouTube IFrame Player API (compliant with ToS)
const player = new YT.Player('container', {
  videoId: 'abc123',
  playerVars: {
    controls: 0,  // Hide YouTube controls
    autoplay: 1,
    playsinline: 1
  }
});
```

### State Management
```javascript
// Use React Context for player state
const { currentTrack, isPlaying, toggle } = usePlayer();
```

### API Integration
```javascript
// YouTube Data API v3 for search
const results = await searchVideos('Sách nói ' + query);
```

### Caching Strategy
```javascript
// Cache metadata only (no audio blobs)
const cached = { videoId, title, author, lastPosition };
await saveAudiobook(cached);
```

---

## 🚀 Deployment

### Recommended Platforms (Free)
1. **Vercel** - Auto-deploy, CDN, custom domain
2. **Netlify** - Drag & drop, form handling
3. **GitHub Pages** - Completely free
4. **Firebase Hosting** - Google integration

**Detailed guide**: [docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md)

---

## ✅ Success Criteria

### Functional Requirements
- [ ] YouTube search works with "Sách nói" prefix
- [ ] Video playback via YouTube IFrame Player
- [ ] Custom controls (play, pause, seek, volume)
- [ ] Queue management (next, previous, repeat)
- [ ] Progress saving and resume
- [ ] Mobile-responsive UI

### Technical Requirements
- [ ] No backend dependencies
- [ ] YouTube ToS compliant
- [ ] PWA installable
- [ ] Offline metadata caching
- [ ] Performance optimized

### Quality Standards
- [ ] Clean, maintainable code
- [ ] Error handling for API failures
- [ ] Loading states for all async operations
- [ ] Accessibility compliant (WCAG 2.1)

---

## 🆘 Troubleshooting

### Common Issues
1. **YouTube API quota exceeded** - Check API usage in Google Cloud Console
2. **CORS errors** - Ensure API key restrictions are correct
3. **Player not loading** - Check YouTube IFrame API script loading
4. **Search not working** - Verify API key and network connectivity

### Debug Commands
```bash
# Check build
npm run build
npm run preview

# Check dependencies
npm list

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- **[YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)**
- **[YouTube Data API v3](https://developers.google.com/youtube/v3)**
- **[Vite Documentation](https://vitejs.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)**

---

**🎯 Goal**: Create a fully functional audiobook player that rivals commercial apps while being completely free and open-source.

**⚡ Quick Start**: Follow Phase 1 prompts (01-09) in order for a working app. Add Phase 2 features as needed.
