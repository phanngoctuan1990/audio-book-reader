# Feature 07: Background Audio Playback

## 🎯 Mục tiêu
Cho phép audio tiếp tục phát khi tắt màn hình điện thoại hoặc chuyển sang app khác (background playback).

## 📋 Yêu cầu

### 1. Media Session API Integration (`src/services/mediaSession.js`)
```javascript
// Enhanced Media Session API
export function setupMediaSession(track, controls) {
  if (!('mediaSession' in navigator)) return;
  
  // Set metadata
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.author,
    album: 'AudioBookReader',
    artwork: [
      { src: track.thumbnail, sizes: '96x96', type: 'image/jpeg' },
      { src: track.thumbnail, sizes: '128x128', type: 'image/jpeg' },
      { src: track.thumbnail, sizes: '192x192', type: 'image/jpeg' },
      { src: track.thumbnail, sizes: '256x256', type: 'image/jpeg' },
      { src: track.thumbnail, sizes: '384x384', type: 'image/jpeg' },
      { src: track.thumbnail, sizes: '512x512', type: 'image/jpeg' }
    ]
  });
  
  // Set action handlers
  navigator.mediaSession.setActionHandler('play', controls.play);
  navigator.mediaSession.setActionHandler('pause', controls.pause);
  navigator.mediaSession.setActionHandler('previoustrack', controls.previous);
  navigator.mediaSession.setActionHandler('nexttrack', controls.next);
  navigator.mediaSession.setActionHandler('seekbackward', controls.seekBackward);
  navigator.mediaSession.setActionHandler('seekforward', controls.seekForward);
  navigator.mediaSession.setActionHandler('seekto', controls.seekTo);
}

// Update playback state
export function updateMediaSessionState(state) {
  if (!('mediaSession' in navigator)) return;
  
  navigator.mediaSession.playbackState = state; // 'playing' | 'paused'
}

// Update position state
export function updateMediaSessionPosition(position, duration, playbackRate = 1) {
  if (!('mediaSession' in navigator) || !('setPositionState' in navigator.mediaSession)) return;
  
  navigator.mediaSession.setPositionState({
    duration: duration,
    playbackRate: playbackRate,
    position: position
  });
}
```

### 2. Wake Lock API (`src/services/wakeLock.js`)
```javascript
// Prevent screen from turning off during playback (optional)
let wakeLock = null;

export async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return false;
  
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake lock acquired');
    return true;
  } catch (err) {
    console.error('Wake lock failed:', err);
    return false;
  }
}

export function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
    console.log('Wake lock released');
  }
}

// Auto-release when page becomes hidden
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && wakeLock) {
    releaseWakeLock();
  }
});
```

### 3. Background Playback Service (`src/services/backgroundPlayback.js`)
```javascript
// Handle background playback lifecycle
export class BackgroundPlaybackManager {
  constructor() {
    this.isBackgroundPlayback = false;
    this.setupVisibilityHandlers();
    this.setupBeforeUnloadHandler();
  }
  
  setupVisibilityHandlers() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.onEnterBackground();
      } else {
        this.onEnterForeground();
      }
    });
  }
  
  setupBeforeUnloadHandler() {
    window.addEventListener('beforeunload', (e) => {
      // Warn user if audio is playing
      if (this.isPlaying) {
        e.preventDefault();
        e.returnValue = 'Audio đang phát. Bạn có chắc muốn thoát?';
        return e.returnValue;
      }
    });
  }
  
  onEnterBackground() {
    this.isBackgroundPlayback = true;
    console.log('Entered background mode');
    
    // Reduce unnecessary operations
    this.pauseNonEssentialUpdates();
  }
  
  onEnterForeground() {
    this.isBackgroundPlayback = false;
    console.log('Returned to foreground');
    
    // Resume normal operations
    this.resumeNormalUpdates();
  }
  
  pauseNonEssentialUpdates() {
    // Reduce UI update frequency
    // Pause animations
    // Minimize network requests
  }
  
  resumeNormalUpdates() {
    // Resume normal UI updates
    // Resume animations
    // Resume normal network activity
  }
}
```

### 4. Update YouTube Player Context (`src/contexts/YouTubePlayerContext.jsx`)
```javascript
// Enhanced với background playback support
import { setupMediaSession, updateMediaSessionState, updateMediaSessionPosition } from '../services/mediaSession';
import { BackgroundPlaybackManager } from '../services/backgroundPlayback';

export function YouTubePlayerProvider({ children }) {
  const backgroundManager = useRef(new BackgroundPlaybackManager());
  
  // Setup Media Session when track changes
  useEffect(() => {
    if (state.currentTrack) {
      setupMediaSession(state.currentTrack, {
        play: () => {
          playVideo();
          dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
        },
        pause: () => {
          pauseVideo();
          dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
        },
        previous: playPrevious,
        next: playNext,
        seekBackward: () => seekBy(-10),
        seekForward: () => seekBy(30),
        seekTo: (details) => {
          if (details.seekTime) {
            seek(details.seekTime);
          }
        }
      });
    }
  }, [state.currentTrack]);
  
  // Update Media Session state
  useEffect(() => {
    updateMediaSessionState(state.isPlaying ? 'playing' : 'paused');
  }, [state.isPlaying]);
  
  // Update Media Session position
  useEffect(() => {
    if (state.isPlaying && state.duration > 0) {
      updateMediaSessionPosition(state.currentTime, state.duration, state.playbackSpeed);
    }
  }, [state.currentTime, state.duration, state.playbackSpeed, state.isPlaying]);
  
  // Background playback manager
  useEffect(() => {
    backgroundManager.current.isPlaying = state.isPlaying;
  }, [state.isPlaying]);
  
  // ... rest of component
}
```

### 5. Service Worker Enhancement (`public/sw.js`)
```javascript
// Enhanced service worker for background support
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'BACKGROUND_SYNC') {
    // Handle background sync for offline playback
    event.waitUntil(handleBackgroundSync(event.data));
  }
});

async function handleBackgroundSync(data) {
  // Sync playback position
  // Cache audio metadata
  // Handle offline scenarios
}

// Keep service worker alive during audio playback
self.addEventListener('fetch', (event) => {
  // Intercept audio requests to ensure continuity
  if (event.request.url.includes('youtube.com') || event.request.url.includes('googlevideo.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback for offline scenarios
        return new Response('Audio temporarily unavailable', { status: 503 });
      })
    );
  }
});
```

### 6. PWA Manifest Updates (`public/manifest.json`)
```json
{
  "name": "AudioBookReader",
  "short_name": "AudioBook",
  "display": "standalone",
  "background_color": "#0f0f1a",
  "theme_color": "#667eea",
  "categories": ["music", "entertainment", "education"],
  "shortcuts": [
    {
      "name": "Play/Pause",
      "short_name": "Play",
      "description": "Toggle audio playback",
      "url": "/?action=toggle",
      "icons": [{ "src": "/icons/play-192.png", "sizes": "192x192" }]
    }
  ]
}
```

## 🎨 UI Requirements

### Lock Screen Controls
- Track title và artist name
- Album artwork (track thumbnail)
- Play/Pause, Previous/Next buttons
- Seek bar với position display
- Background app icon

### Notification Controls (Android)
- Persistent notification during playback
- Media controls in notification
- Progress indicator
- Quick actions (skip, pause)

### iOS Safari Considerations
- Media Session API support
- Lock screen integration
- Control Center integration
- Background audio permissions

## 🔧 Technical Requirements

### Audio Continuity
```javascript
// Ensure audio doesn't stop when screen locks
- Use Media Session API properly
- Handle visibility change events
- Maintain YouTube player state
- Prevent automatic pause on blur
```

### Performance Optimization
```javascript
// Reduce resource usage in background
- Lower UI update frequency
- Pause non-essential animations
- Minimize network requests
- Reduce CPU usage
```

### Error Handling
```javascript
// Handle background playback failures
- Network disconnection
- YouTube player errors
- Browser limitations
- Permission denials
```

## 📱 Mobile Optimization

### iOS Safari
- Add to Home Screen prompt
- Media Session API integration
- Background audio permissions
- Lock screen controls

### Android Chrome
- PWA installation
- Background sync
- Notification controls
- Battery optimization handling

### Cross-Platform
- Feature detection
- Graceful degradation
- User education about limitations
- Alternative solutions for unsupported browsers

## 🧪 Testing Checklist

### Background Playback
- [ ] Audio continues when screen locks
- [ ] Audio continues when switching apps
- [ ] Lock screen controls work
- [ ] Notification controls functional (Android)
- [ ] Media Session API integration
- [ ] Position tracking in background
- [ ] Auto-resume when returning to app

### Performance
- [ ] Reduced CPU usage in background
- [ ] Battery usage optimized
- [ ] Memory usage stable
- [ ] No audio glitches during transitions

### Error Scenarios
- [ ] Network disconnection handling
- [ ] YouTube player errors
- [ ] Browser tab closure prevention
- [ ] Graceful degradation on unsupported browsers

## 💡 Implementation Notes

### Browser Support
- **Chrome/Edge**: Full Media Session API support
- **Firefox**: Partial support, basic controls
- **Safari**: iOS 13.4+ support, some limitations
- **Fallback**: Basic audio element behavior

### User Education
```javascript
// Inform users about background playback
const BackgroundPlaybackInfo = () => (
  <div className="info-banner">
    <h3>🎵 Phát nhạc nền</h3>
    <p>Để nghe nhạc khi tắt màn hình:</p>
    <ul>
      <li>📱 Thêm app vào Home Screen (iOS)</li>
      <li>🔔 Cho phép thông báo (Android)</li>
      <li>⚡ Tắt tối ưu pin cho app này</li>
    </ul>
  </div>
);
```

### Progressive Enhancement
- Start với basic Media Session API
- Add Wake Lock API nếu supported
- Enhance với Service Worker
- Optimize cho từng platform

## 🔒 Privacy & Permissions

### Required Permissions
- Media Session (automatic)
- Wake Lock (user gesture required)
- Notifications (user consent)
- Background sync (PWA installation)

### Privacy Considerations
- No tracking during background playback
- Minimal data usage in background
- User control over background behavior
- Clear permission explanations

---

**🎯 Goal**: Enable seamless background audio playback that works across all major mobile browsers and provides native-like lock screen controls.
