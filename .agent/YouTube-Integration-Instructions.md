# 🎵 AudioBookReader - YouTube Integration Instructions

## 📋 Project Overview
AudioBookReader được refactor để sử dụng YouTube IFrame Player API thay vì backend/proxy, áp dụng logic từ Music-CLI analysis.

## 🎯 Core Architecture Changes

### Before (Backend-dependent)
```
User → React App → Proxy Server → YouTube API → Audio Stream
```

### After (Direct YouTube Integration)
```
User → React App → YouTube IFrame Player API → Direct YouTube Stream
```

## 🔧 Key Components

### 1. YouTube Service (`src/services/youtube.js`)
- YouTube IFrame Player API integration
- YouTube Data API v3 for search
- Player control functions
- Event handling

### 2. YouTube Player Context (`src/contexts/YouTubePlayerContext.jsx`)
- State management for YouTube player
- Queue management
- Player lifecycle handling

### 3. YouTube Player Component (`src/components/player/YouTubePlayer.jsx`)
- IFrame container with custom controls
- Progress bar, volume slider
- Responsive design

## 🚀 Implementation Guidelines

### Code Style
- **Minimal implementation** - Only essential code
- **Functional approach** - Prefer functions over classes
- **Error handling** - Basic error boundaries
- **Performance** - Optimize API calls

### API Integration
```javascript
// YouTube Data API v3
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// YouTube IFrame Player
const YOUTUBE_IFRAME_API = 'https://www.youtube.com/iframe_api';
```

### State Management
- Use existing PlayerContext structure
- Maintain compatibility with current components
- Handle YouTube-specific states (buffering, error)

## 📱 UI/UX Principles

### Design Consistency
- Keep existing dark theme
- Maintain current navigation structure
- Preserve mobile-first approach

### User Experience
- Smooth transitions between tracks
- Loading states for API calls
- Error messages for API failures
- Offline behavior handling

## 🔐 Environment Setup

### Required Variables
```env
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_APP_NAME=AudioBookReader
```

### API Limits
- YouTube Data API v3: 10,000 units/day default
- Search: 100 units per request
- Video details: 1 unit per request

## 🧪 Testing Strategy

### Core Functionality
- [ ] YouTube video search works
- [ ] Video playback smooth
- [ ] Player controls responsive
- [ ] Queue management functional
- [ ] Error handling proper

### Edge Cases
- [ ] No internet connection
- [ ] API quota exceeded
- [ ] Invalid video IDs
- [ ] Mobile compatibility

## 📚 Dependencies

### Remove
- Backend proxy dependencies
- HTML5 Audio specific code
- Stream URL fetching logic

### Add
- YouTube IFrame Player API
- YouTube Data API v3 integration
- Environment variable validation

## 🎯 Success Criteria

1. **No Backend Dependency** - App works without proxy server
2. **YouTube Compliance** - Uses official YouTube APIs only
3. **Performance** - Fast loading, smooth playback
4. **Compatibility** - Works on existing UI/UX
5. **Maintainability** - Clean, minimal codebase

## 🔄 Migration Path

1. **Phase 1**: Core YouTube integration (Prompts 1-3)
2. **Phase 2**: API layer updates (Prompts 4-6)
3. **Phase 3**: UI updates & config (Prompts 7-8)
4. **Phase 4**: Testing & cleanup (Prompt 9)

## 📖 Reference
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Music-CLI Analysis Report](../reports/music-cli-analysis-report.md)
