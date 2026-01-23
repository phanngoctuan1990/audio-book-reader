# 🎵 AudioBookReader v2.0 - Implementation Prompts

## 🎯 Master Prompt for AI Agents

This directory contains **complete implementation prompts** to build AudioBookReader v2.0 from scratch. An AI agent can follow these prompts sequentially to create a fully functional audiobook player.

## 📋 Quick Start for AI Agents

### Prerequisites
```bash
# 1. Create new Vite + React project
npm create vite@latest audiobook-reader -- --template react
cd audiobook-reader

# 2. Install dependencies
npm install idb
npm install -D tailwindcss autoprefixer postcss vite-plugin-pwa

# 3. Setup Tailwind CSS
npx tailwindcss init -p
```

### Environment Setup
```bash
# 4. Create .env file
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_APP_NAME=AudioBookReader
VITE_APP_VERSION=2.0.0
```

**📚 Get YouTube API Key**: Follow [../docs/YOUTUBE_API_SETUP.md](../docs/YOUTUBE_API_SETUP.md)

## 🚀 Implementation Sequence

### Phase 1: Core Implementation (Required)
Execute these prompts **in exact order**:

| Step | Prompt | Description | Output |
|------|--------|-------------|---------|
| 1 | [01-youtube-service.md](./01-youtube-service.md) | YouTube API integration | `src/services/youtube.js` |
| 2 | [02-youtube-player-context.md](./02-youtube-player-context.md) | Player state management | `src/contexts/YouTubePlayerContext.jsx` |
| 3 | [03-youtube-player-component.md](./03-youtube-player-component.md) | Player UI components | `src/components/player/YouTubePlayer.jsx` |
| 4 | [04-update-search-hook.md](./04-update-search-hook.md) | Search integration | Update `src/hooks/useSearch.js` |
| 5 | [05-update-player-context.md](./05-update-player-context.md) | Backward compatibility | Update `src/contexts/PlayerContext.jsx` |
| 6 | [06-update-api-service.md](./06-update-api-service.md) | API layer updates | Update `src/services/api.js` |
| 7 | [07-update-components.md](./07-update-components.md) | Component updates | Update existing components |
| 8 | [08-environment-config.md](./08-environment-config.md) | Environment setup | Config files |
| 9 | [09-testing-cleanup.md](./09-testing-cleanup.md) | Testing & cleanup | Final testing |

### Phase 2: Enhanced Features (Optional)
Choose features to implement from `features/` directory:

| Feature | Prompt | Description |
|---------|--------|-------------|
| 🎵 Radio Mode | [features/01-radio-streaming.md](./features/01-radio-streaming.md) | Add radio streaming like Music-CLI |
| 📋 Advanced Playlists | [features/02-playlist-management.md](./features/02-playlist-management.md) | Enhanced playlist management |
| 🎛️ Player Controls | [features/03-advanced-player-controls.md](./features/03-advanced-player-controls.md) | Repeat modes, visualizer |
| 🔍 Enhanced Search | [features/04-enhanced-search.md](./features/04-enhanced-search.md) | URL paste, grid view, filters |
| 📑 Tab Navigation | [features/05-tab-navigation.md](./features/05-tab-navigation.md) | YouTube/Radio tab system |
| 🎵 Rich Player | [features/06-enhanced-now-playing.md](./features/06-enhanced-now-playing.md) | Enhanced now playing display |

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
