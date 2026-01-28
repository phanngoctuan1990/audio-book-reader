# YouTube Player Component v2.0 - Context Splitting

## 🎯 Objective
Create player UI components optimized for v2.0 architecture with context splitting.

## 📋 Implementation

### 1. Create Optimized Player Component
```javascript
// src/components/player/YouTubePlayer.jsx
import { useContext } from "react";
import { PlayerStateContext, PlayerActionsContext } from "../../contexts/PlayerContext";
import { PLAYER_CONFIG } from "../../utils/constants";

function YouTubePlayer() {
  // Context splitting for performance
  const { currentTrack, isPlaying, currentTime, duration } = useContext(PlayerStateContext);
  const { play, pause, seek } = useContext(PlayerActionsContext);

  if (!currentTrack) return null;

  return (
    <div className="youtube-player">
      {/* Hidden YouTube container */}
      <div id={PLAYER_CONFIG.PLAYER_CONTAINER_ID} style={{ display: 'none' }} />
      
      {/* Player UI */}
      <PlayerUI 
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
      />
    </div>
  );
}

// Separate UI component (won't re-render on time updates if using actions only)
function PlayerControls() {
  const { play, pause, playNext, playPrevious } = useContext(PlayerActionsContext);
  
  return (
    <div className="player-controls">
      <button onClick={playPrevious}>⏮️</button>
      <button onClick={play}>▶️</button>
      <button onClick={pause}>⏸️</button>
      <button onClick={playNext}>⏭️</button>
    </div>
  );
}

export default YouTubePlayer;
```

### 2. Create Progress Bar Component
```javascript
// src/components/player/ProgressBar.jsx
import { useContext } from "react";
import { PlayerStateContext, PlayerActionsContext } from "../../contexts/PlayerContext";
import { formatTime } from "../../utils/formatters";

function ProgressBar() {
  const { currentTime, duration } = useContext(PlayerStateContext);
  const { seek } = useContext(PlayerActionsContext);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    seek(time);
  };

  return (
    <div className="progress-bar" onClick={handleSeek}>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="time-display">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default ProgressBar;
```

### 3. Create Track Info Component
```javascript
// src/components/player/TrackInfo.jsx
import { useContext } from "react";
import { PlayerStateContext } from "../../contexts/PlayerContext";

function TrackInfo() {
  // Only subscribes to state, won't re-render on action calls
  const { currentTrack, isPlaying } = useContext(PlayerStateContext);

  if (!currentTrack) return null;

  return (
    <div className="track-info">
      <img src={currentTrack.thumbnail} alt={currentTrack.title} />
      <div className="track-details">
        <h3>{currentTrack.title}</h3>
        <p>{currentTrack.author}</p>
        {isPlaying && <div className="playing-indicator">🎵</div>}
      </div>
    </div>
  );
}

export default TrackInfo;
```

## ✅ Key Benefits of v2.0
- **Performance**: Components using only actions won't re-render on time updates
- **Clean Separation**: State vs Actions clearly separated
- **Constants Usage**: All magic numbers from constants.js
- **Optimized Rendering**: Minimal re-renders with context splitting

## 🔄 Migration from v1.0
- Replace `usePlayer()` with specific context hooks
- Use constants instead of magic numbers
- Separate components by state vs action usage

### Props Interface
```jsx
YouTubePlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  onStateChange: PropTypes.func,
  onError: PropTypes.func,
  autoplay: PropTypes.bool,
  controls: PropTypes.bool
}
```

### Integration
- Sử dụng YouTube service functions
- Connect với PlayerContext
- Handle player events và state updates

### Styling
- Minimal UI, focus vào functionality
- Dark theme tương thích với app hiện tại
- Responsive cho mobile/desktop

## Lưu ý
- Component tự contained, không depend vào external state
- Handle loading states
- Error boundaries cho YouTube API failures
