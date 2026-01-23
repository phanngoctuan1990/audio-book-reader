# Feature 03: Advanced Player Controls

## 🎯 Mục tiêu
Thêm Repeat modes, Auto-play next, và Audio Visualizer như Music-CLI.

## 📋 Yêu cầu

### 1. Update Player Context (`src/contexts/PlayerContext.jsx`)
```javascript
// Add new state
const initialState = {
  // ... existing state
  repeatMode: 'none', // 'none', 'one', 'all'
  autoPlayNext: true,
  isShuffled: false,
  visualizerEnabled: true
};

// Add new actions
const ACTIONS = {
  // ... existing actions
  SET_REPEAT_MODE: 'SET_REPEAT_MODE',
  TOGGLE_AUTO_PLAY: 'TOGGLE_AUTO_PLAY',
  TOGGLE_SHUFFLE: 'TOGGLE_SHUFFLE',
  TOGGLE_VISUALIZER: 'TOGGLE_VISUALIZER'
};

// New functions needed
- setRepeatMode(mode) // 'none', 'one', 'all'
- toggleAutoPlay()
- toggleShuffle()
- handleTrackEnd() // Enhanced with repeat logic
```

### 2. Tạo Player Controls Component (`src/components/player/PlayerControls.jsx`)
```javascript
// Enhanced controls layout
<div className="player-controls">
  {/* Primary Controls */}
  <div className="primary-controls">
    <button onClick={playPrevious}>⏮️</button>
    <button onClick={toggle} className="play-pause-btn">
      {isPlaying ? '⏸️' : '▶️'}
    </button>
    <button onClick={playNext}>⏭️</button>
  </div>
  
  {/* Secondary Controls */}
  <div className="secondary-controls">
    <RepeatButton mode={repeatMode} onChange={setRepeatMode} />
    <ShuffleButton enabled={isShuffled} onChange={toggleShuffle} />
    <AutoPlayButton enabled={autoPlayNext} onChange={toggleAutoPlay} />
    <VisualizerButton enabled={visualizerEnabled} onChange={toggleVisualizer} />
  </div>
</div>
```

### 3. Tạo Control Buttons

#### `src/components/player/RepeatButton.jsx`
```javascript
// Repeat modes: none → one → all → none
const RepeatButton = ({ mode, onChange }) => {
  const icons = {
    none: '🔁',
    one: '🔂', 
    all: '🔁'
  };
  
  const handleClick = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    onChange(nextMode);
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`repeat-btn ${mode !== 'none' ? 'active' : ''}`}
    >
      {icons[mode]}
      {mode === 'one' && <span className="indicator">1</span>}
    </button>
  );
};
```

#### `src/components/player/ShuffleButton.jsx`
- Toggle shuffle mode
- Visual indicator when active
- Shuffle queue when enabled

#### `src/components/player/AutoPlayButton.jsx`
- Toggle auto-play next track
- Visual indicator when enabled
- Persist setting in localStorage

### 4. Tạo Audio Visualizer (`src/components/player/AudioVisualizer.jsx`)
```javascript
// Canvas-based audio visualizer
const AudioVisualizer = ({ audioRef, enabled }) => {
  const canvasRef = useRef();
  const animationRef = useRef();
  
  useEffect(() => {
    if (!enabled || !audioRef.current) return;
    
    // Setup Web Audio API
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Animation loop
    const animate = () => {
      // Draw frequency bars
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, audioRef]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="audio-visualizer"
      width={200}
      height={60}
    />
  );
};
```

### 5. Enhanced Track End Handling
```javascript
// In PlayerContext
const handleTrackEnd = () => {
  switch (repeatMode) {
    case 'one':
      // Replay current track
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      break;
      
    case 'all':
      // Play next, or first if at end
      if (queueIndex < queue.length - 1) {
        playNext();
      } else {
        setQueueIndex(0);
        loadTrack(queue[0]);
      }
      break;
      
    case 'none':
    default:
      // Play next if auto-play enabled
      if (autoPlayNext && queueIndex < queue.length - 1) {
        playNext();
      }
      break;
  }
};
```

## 🎨 UI Requirements

### Control Button Design
- Consistent icon style
- Active state indicators
- Smooth transitions
- Touch-friendly sizing (44px minimum)

### Visualizer Design
- Positioned in corner (like Music-CLI)
- Smooth animations
- Color matching app theme
- Performance optimized

### Layout Integration
- Fit in existing MiniPlayer
- Expandable in full player view
- Responsive for different screen sizes

## 🔧 Technical Requirements

### Repeat Logic
- Track current repeat mode
- Handle queue end scenarios
- Persist user preferences
- Update Media Session API

### Shuffle Implementation
- Fisher-Yates shuffle algorithm
- Preserve current track position
- Visual feedback for shuffled state
- Unshuffle capability

### Audio Visualizer
- Web Audio API integration
- Canvas rendering
- 60fps animation target
- Frequency analysis
- Low CPU usage

### Performance
- Debounced control updates
- Efficient canvas rendering
- Memory leak prevention
- Battery optimization

## 📱 Mobile Optimization
- Touch gesture support
- Haptic feedback for controls
- Battery-aware visualizer
- Background processing

## 🧪 Testing Checklist
- [ ] Repeat none works
- [ ] Repeat one loops current track
- [ ] Repeat all loops entire queue
- [ ] Shuffle randomizes queue
- [ ] Auto-play advances tracks
- [ ] Visualizer displays correctly
- [ ] Controls persist settings
- [ ] Mobile touch responsive
- [ ] Performance acceptable
- [ ] Battery usage reasonable

## 💡 Implementation Notes
- Start with repeat modes (highest priority)
- Add visualizer as progressive enhancement
- Use requestAnimationFrame for smooth animations
- Implement settings persistence
- Consider accessibility for visualizer (motion sensitivity)
