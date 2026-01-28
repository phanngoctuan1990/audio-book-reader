# 📚 AudioBookReader - Development Prompts v2.0

## 🏗️ **IMPORTANT: Refactored Architecture**
**⚠️ The codebase has been completely refactored!** Current architecture uses modular hooks and context splitting.

### **Current Architecture (v2.0):**
```
src/contexts/PlayerContext.jsx (223 lines) - Main orchestrator
src/hooks/
├── useYouTubePlayerCore.js - Player instance & events  
├── usePlayerQueue.js - Queue, shuffle, repeat
├── usePlayerPersistence.js - localStorage sync
└── usePlayerBackground.js - Media session, wake lock
src/utils/constants.js - All app constants (NO magic numbers)
```

## 📋 **Updated Prompts (v2.0 Compatible)**

### **✅ Core Implementation (Updated)**
1. **01-youtube-service.md** - YouTube API with constants & formatters
2. **02-youtube-player-context.md** - Modular hook architecture

### **⚠️ Legacy Prompts (Need Updates)**
3. **03-youtube-player-component.md** - Needs context splitting updates
4. **04-update-search-hook.md** - Needs constants integration  
5. **05-update-player-context.md** - Obsolete (replaced by hooks)
6. **06-update-api-service.md** - Needs formatters integration
7. **07-update-components.md** - Needs performance optimization
8. **08-environment-config.md** - Still valid
9. **09-testing-cleanup.md** - Needs hook testing updates

### **✅ Feature Prompts (Still Valid)**
- `features/01-07-*.md` - Advanced features (compatible)
- `UI/COMPLETE_UI_GUIDE.md` - Soft Gold theme (compatible)

## 🚀 **Quick Start for v2.0**

### **New Features (Recommended Pattern):**
```javascript
// 1. Create hook in src/hooks/
export function usePlayerNewFeature(state, actions) {
  // Feature logic here
  return featureAPI;
}

// 2. Integrate in PlayerContext.jsx
const newFeature = usePlayerNewFeature(state, actions);

// 3. Use constants from constants.js
import { PLAYER_CONFIG } from "../utils/constants";
```

### **Component Performance:**
```javascript
// Optimized: Use context splitting
const { currentTrack } = useContext(PlayerStateContext); // State only
const { play } = useContext(PlayerActionsContext); // Actions only
// Component won't re-render on time updates!
```

## 📊 **Architecture Benefits**
- ✅ **65% code reduction** (640 → 223 lines in main context)
- ✅ **Performance optimized** (context splitting)
- ✅ **100% constants** (no magic numbers)
- ✅ **Modular hooks** (easy testing)
- ✅ **Backward compatible** (`usePlayer()` still works)

## 🔄 **Migration Notes**
- **Constants**: Import from `constants.js` (required)
- **Context**: Use `usePlayerState()` + `usePlayerActions()` for performance
- **Hooks**: Prefer composition over monolithic components
- **Testing**: Each hook can be tested independently

---

**Status**: Core prompts updated ✅ | Legacy prompts need updates ⚠️
Choose features to implement from `features/` directory:

| Feature | Prompt | Description |
|---------|--------|-------------|
| 🎵 Radio Mode | [features/01-radio-streaming.md](./features/01-radio-streaming.md) | Add radio streaming like Music-CLI |
| 📋 Advanced Playlists | [features/02-playlist-management.md](./features/02-playlist-management.md) | Enhanced playlist management |
| 🎛️ Player Controls | [features/03-advanced-player-controls.md](./features/03-advanced-player-controls.md) | Repeat modes, visualizer |
| 🔍 Enhanced Search | [features/04-enhanced-search.md](./features/04-enhanced-search.md) | URL paste, grid view, filters |
| 📑 Tab Navigation | [features/05-tab-navigation.md](./features/05-tab-navigation.md) | YouTube/Radio tab system |
| 🎵 Rich Player | [features/06-enhanced-now-playing.md](./features/06-enhanced-now-playing.md) | Enhanced now playing display |
| 🔒 Background Audio | [features/07-background-audio.md](./features/07-background-audio.md) | Audio playback khi tắt màn hình |

## 🎯 Success Criteria

After completing Phase 1, the app should have:

### ✅ Core Functionality
- [ ] YouTube search with "Sách nói" prefix
- [ ] Video playback via YouTube IFrame Player
- [ ] Custom controls (play, pause, seek, volume)
- [ ] Queue management (next, previous)
- [ ] Progress saving and resume
- [ ] Mobile-responsive UI
- [ ] PWA installable

### ✅ Technical Requirements
- [ ] No backend dependencies
- [ ] YouTube ToS compliant
- [ ] Clean, maintainable code
- [ ] Error handling for API failures
- [ ] Loading states for async operations

## 🔧 Implementation Guidelines

### Code Style
```javascript
// Use functional components with hooks
function Component() {
  const [state, setState] = useState();
  return <div>...</div>;
}

// Use context for global state
const { currentTrack, isPlaying } = usePlayer();

// Handle errors gracefully
try {
  const result = await apiCall();
} catch (error) {
  console.error('Error:', error);
  showToast('Có lỗi xảy ra');
}
```

### File Naming
- Components: `PascalCase.jsx` (SearchBar.jsx)
- Hooks: `camelCase.js` with `use` prefix (useSearch.js)
- Services: `camelCase.js` (youtube.js)
- Contexts: `PascalCase.jsx` with `Context` suffix

### Mobile-First Design
```css
/* Default: Mobile (375px+) */
.component { }

/* Tablet (768px+) */
@media (min-width: 768px) { }

/* Desktop (1024px+) */
@media (min-width: 1024px) { }
```

## 📱 Key Architecture Decisions

### 1. YouTube Integration
- **Use YouTube IFrame Player API** (ToS compliant)
- **YouTube Data API v3** for search
- **No direct video downloads** (streaming only)

### 2. State Management
- **React Context** for player state
- **IndexedDB** for metadata caching
- **localStorage** for user preferences

### 3. UI Framework
- **Tailwind CSS** for styling
- **Mobile-first** responsive design
- **Dark theme** as primary

### 4. Performance
- **Code splitting** by routes
- **Lazy loading** for components
- **Service worker** for caching

## 🚨 Common Pitfalls to Avoid

### ❌ Don't Do
```javascript
// Don't use HTML5 Audio for YouTube content
const audio = new Audio(youtubeUrl); // ❌ Violates ToS

// Don't download YouTube videos
fetch(videoUrl).then(blob => ...); // ❌ Not allowed

// Don't use backend proxy for YouTube API
fetch('/api/youtube/search'); // ❌ Unnecessary complexity
```

### ✅ Do This Instead
```javascript
// Use YouTube IFrame Player API
const player = new YT.Player('container', {
  videoId: 'abc123',
  events: { onReady: handleReady }
});

// Use YouTube Data API v3 directly
const results = await fetch(
  `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${query}`
);
```

## 📚 Additional Resources

- **[Implementation Guide](../docs/IMPLEMENTATION_GUIDE.md)** - Complete overview
- **[Project Structure](../docs/PROJECT_STRUCTURE.md)** - File organization
- **[Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)** - Deploy instructions
- **[YouTube API Setup](../docs/YOUTUBE_API_SETUP.md)** - API configuration

## 🎯 Expected Timeline

### For Experienced AI Agent:
- **Phase 1**: 2-3 hours (core functionality)
- **Phase 2**: 1-2 hours per feature (optional enhancements)

### For Learning AI Agent:
- **Phase 1**: 4-6 hours (with learning curve)
- **Phase 2**: 2-3 hours per feature

## 🆘 Troubleshooting

### Common Issues:
1. **YouTube API quota exceeded** → Check Google Cloud Console
2. **CORS errors** → Verify API key restrictions
3. **Player not loading** → Check IFrame API script
4. **Build errors** → Verify all dependencies installed

### Debug Commands:
```bash
npm run build    # Test production build
npm run preview  # Test built app locally
npm list         # Check installed packages
```

---

**🎯 Goal**: Create a production-ready audiobook player that rivals commercial apps while being completely free and open-source.

**⚡ Start Here**: Begin with prompt 01 and follow the sequence. Each prompt builds on the previous one.
