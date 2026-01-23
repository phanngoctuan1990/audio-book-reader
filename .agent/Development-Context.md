# 🎵 AudioBookReader - Development Context

## 🎯 Current Project Status
**Migrating from backend-dependent to YouTube IFrame Player API integration**

### Architecture Transition
- **FROM**: React App → Proxy Server → YouTube API → Audio Stream
- **TO**: React App → YouTube IFrame Player API → Direct YouTube Stream

## 🔧 Active Development Focus

### Implementation Strategy
- **Minimal Code**: Only essential functionality
- **Direct Integration**: No backend/proxy dependencies  
- **API Compliance**: Use official YouTube APIs only
- **UI Preservation**: Maintain existing user experience

### Key Technologies
- YouTube IFrame Player API
- YouTube Data API v3
- React Context for state management
- Vite for build tooling

## 📋 Current Task Context

### Execution Plan
Following prompts in `/prompts/` directory:
1. Core YouTube integration (Services, Context, Components)
2. API layer updates (Search, Player, Services)
3. UI updates and configuration
4. Testing and cleanup

### Code Guidelines
```javascript
// Preferred patterns
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Minimal error handling
try {
  const result = await youtubeAPI.search(query);
  return formatResults(result);
} catch (error) {
  console.error('YouTube API error:', error);
  throw new Error('Search failed');
}

// State management
const [state, dispatch] = useReducer(playerReducer, initialState);
```

## 🎨 UI/UX Context

### Design System
- **Theme**: Dark mode primary
- **Layout**: Mobile-first, responsive
- **Navigation**: Bottom tab navigation
- **Player**: Mini player + expanded view

### Component Structure
```
App
├── PlayerProvider (YouTube integration)
├── ToastProvider
├── Pages (Home, Library, Favorites, Downloads)
├── MiniPlayer (YouTube controls)
└── BottomNav
```

## 🔐 Environment Context

### Required Setup
```env
VITE_YOUTUBE_API_KEY=your_key_here
VITE_APP_NAME=AudioBookReader
```

### API Constraints
- YouTube Data API quota: 10,000 units/day
- Search cost: 100 units per request
- Rate limiting: Handle gracefully

## 📱 Target User Experience

### Core Features
- Search audiobooks on YouTube
- Play with custom controls
- Queue management
- Offline playlist (metadata only)
- Progress tracking

### Performance Goals
- Fast search results (< 2s)
- Smooth playback transitions
- Responsive UI (< 100ms interactions)
- Minimal API calls

## 🧪 Quality Standards

### Code Quality
- TypeScript-like prop validation
- Error boundaries for API failures
- Loading states for all async operations
- Mobile-optimized touch interactions

### Testing Approach
- Manual testing for each prompt
- Cross-browser compatibility
- Mobile device testing
- API error scenario testing

## 📚 Reference Materials
- Music-CLI analysis report: `/reports/music-cli-analysis-report.md`
- Implementation prompts: `/prompts/`
- YouTube API documentation
- Current codebase structure
