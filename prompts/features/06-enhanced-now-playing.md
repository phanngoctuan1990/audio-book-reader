# Feature 06: Enhanced Now Playing Display

## 🎯 Mục tiêu
Nâng cấp Now Playing display với thông tin chi tiết và duration display như Music-CLI.

## 📋 Yêu cầu

### 1. Tạo Enhanced Mini Player (`src/components/player/EnhancedMiniPlayer.jsx`)
```javascript
// Enhanced mini player with more info
const EnhancedMiniPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading,
    currentTime, 
    duration,
    repeatMode,
    isShuffled,
    queue,
    queueIndex
  } = usePlayer();
  
  if (!currentTrack) return null;
  
  return (
    <div className="enhanced-mini-player">
      {/* Progress Bar */}
      <ProgressBar 
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
      />
      
      {/* Main Content */}
      <div className="player-content">
        <TrackInfo 
          track={currentTrack}
          currentTime={currentTime}
          duration={duration}
        />
        
        <PlayerControls 
          isPlaying={isPlaying}
          isLoading={isLoading}
          repeatMode={repeatMode}
          isShuffled={isShuffled}
          onToggle={toggle}
          onNext={playNext}
          onPrevious={playPrevious}
        />
        
        <QueueInfo 
          queue={queue}
          currentIndex={queueIndex}
        />
      </div>
    </div>
  );
};
```

### 2. Tạo Track Info Component (`src/components/player/TrackInfo.jsx`)
```javascript
// Detailed track information
const TrackInfo = ({ track, currentTime, duration }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className="track-info">
      {/* Thumbnail with glow effect */}
      <div className="thumbnail-container">
        <img 
          src={track.thumbnail} 
          alt={track.title}
          className={`thumbnail ${isPlaying ? 'playing-glow' : ''}`}
        />
        <div className="play-indicator">
          {isPlaying && <PlayingAnimation />}
        </div>
      </div>
      
      {/* Track Details */}
      <div className="track-details">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-author">{track.author}</p>
        
        {/* Time Display */}
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="separator">/</span>
          <span className="total-time">{formatTime(duration)}</span>
          <span className="progress-percent">({Math.round(progress)}%)</span>
        </div>
        
        {/* Additional Metadata */}
        <div className="metadata">
          <span className="views">{track.views} lượt xem</span>
          <span className="upload-date">{track.uploadedDate}</span>
        </div>
      </div>
    </div>
  );
};
```

### 3. Tạo Playing Animation (`src/components/player/PlayingAnimation.jsx`)
```javascript
// Animated playing indicator
const PlayingAnimation = () => {
  return (
    <div className="playing-animation">
      <div className="bar bar1"></div>
      <div className="bar bar2"></div>
      <div className="bar bar3"></div>
      <div className="bar bar4"></div>
    </div>
  );
};

// CSS for animation
/*
.playing-animation {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 16px;
}

.bar {
  width: 3px;
  background: var(--gradient-primary);
  border-radius: 1px;
  animation: bounce 1.2s ease-in-out infinite;
}

.bar1 { animation-delay: 0s; }
.bar2 { animation-delay: 0.1s; }
.bar3 { animation-delay: 0.2s; }
.bar4 { animation-delay: 0.3s; }

@keyframes bounce {
  0%, 80%, 100% { height: 4px; }
  40% { height: 16px; }
}
*/
```

### 4. Tạo Enhanced Progress Bar (`src/components/player/ProgressBar.jsx`)
```javascript
// Interactive progress bar with time tooltips
const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const progressRef = useRef();
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleMouseMove = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    setHoverTime(Math.max(0, Math.min(duration, time)));
  };
  
  const handleClick = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    onSeek(Math.max(0, Math.min(duration, time)));
  };
  
  return (
    <div 
      ref={progressRef}
      className="progress-bar-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverTime(null)}
      onClick={handleClick}
    >
      {/* Background */}
      <div className="progress-background">
        {/* Loaded progress */}
        <div 
          className="progress-loaded"
          style={{ width: `${progress}%` }}
        />
        
        {/* Current progress */}
        <div 
          className="progress-current"
          style={{ width: `${progress}%` }}
        />
        
        {/* Hover indicator */}
        {hoverTime !== null && (
          <div 
            className="progress-hover"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          />
        )}
      </div>
      
      {/* Time tooltip on hover */}
      {hoverTime !== null && (
        <div 
          className="time-tooltip"
          style={{ left: `${(hoverTime / duration) * 100}%` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
};
```

### 5. Tạo Queue Info Component (`src/components/player/QueueInfo.jsx`)
```javascript
// Display queue information
const QueueInfo = ({ queue, currentIndex }) => {
  if (!queue.length) return null;
  
  const nextTrack = queue[currentIndex + 1];
  const remainingTracks = queue.length - currentIndex - 1;
  
  return (
    <div className="queue-info">
      <div className="queue-status">
        <span className="current-position">
          {currentIndex + 1} / {queue.length}
        </span>
        {remainingTracks > 0 && (
          <span className="remaining">
            {remainingTracks} bài tiếp theo
          </span>
        )}
      </div>
      
      {nextTrack && (
        <div className="next-track">
          <span className="next-label">Tiếp theo:</span>
          <span className="next-title">{nextTrack.title}</span>
        </div>
      )}
    </div>
  );
};
```

### 6. Tạo Full Player View (`src/components/player/FullPlayer.jsx`)
```javascript
// Expanded player view
const FullPlayer = ({ isVisible, onClose }) => {
  const { currentTrack, queue, queueIndex } = usePlayer();
  
  return (
    <div className={`full-player ${isVisible ? 'visible' : ''}`}>
      {/* Header */}
      <div className="full-player-header">
        <button onClick={onClose} className="close-btn">
          ↓
        </button>
        <h2>Đang phát</h2>
        <button className="more-btn">⋯</button>
      </div>
      
      {/* Large Album Art */}
      <div className="large-artwork">
        <img src={currentTrack?.thumbnail} alt={currentTrack?.title} />
      </div>
      
      {/* Track Info */}
      <TrackInfo 
        track={currentTrack}
        currentTime={currentTime}
        duration={duration}
      />
      
      {/* Controls */}
      <FullPlayerControls />
      
      {/* Queue */}
      <UpNextQueue 
        queue={queue}
        currentIndex={queueIndex}
      />
    </div>
  );
};
```

## 🎨 UI Requirements

### Visual Design
- Large, prominent track information
- Smooth animations and transitions
- Gradient backgrounds and glows
- Consistent with app theme

### Typography
- Clear hierarchy for track info
- Readable time displays
- Truncated long titles with tooltips
- Consistent font weights

### Interactive Elements
- Hover effects on progress bar
- Touch-friendly controls
- Visual feedback for interactions
- Smooth state transitions

## 🔧 Technical Requirements

### Time Formatting
```javascript
// Enhanced time formatting
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
```

### Performance
- Throttled progress updates
- Efficient re-renders
- Smooth animations (60fps)
- Memory leak prevention

### Accessibility
- Screen reader support
- Keyboard navigation
- High contrast mode
- Motion reduction support

## 📱 Mobile Optimization
- Touch-friendly progress bar
- Swipe gestures for full player
- Responsive text sizing
- Optimized for small screens

## 🧪 Testing Checklist
- [ ] Time display accurate
- [ ] Progress bar interactive
- [ ] Queue info displays correctly
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Performance acceptable
- [ ] Memory usage reasonable

## 💡 Implementation Notes
- Start with enhanced time display
- Add progress bar interactivity
- Implement smooth animations
- Consider battery impact of animations
- Use CSS transforms for performance
