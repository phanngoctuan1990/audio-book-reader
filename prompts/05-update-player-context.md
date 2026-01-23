# Prompt 5: Update Player Context

## Mục tiêu
Sửa file `src/contexts/PlayerContext.jsx` để sử dụng YouTube Player thay vì HTML5 Audio.

## Yêu cầu
Update file `src/contexts/PlayerContext.jsx`:

### Replace Audio Element
- Remove `audioRef` và HTML5 Audio logic
- Integrate với YouTubePlayerContext
- Update all player methods để work với YouTube Player

### State Management
- Maintain existing state structure
- Update state updates để sync với YouTube Player
- Keep existing action types và reducer

### Player Methods
Update các methods:
- `loadTrack()` - Load YouTube video
- `play()`, `pause()`, `toggle()` - YouTube player controls
- `seek()`, `seekBy()` - YouTube seek functions
- `setSpeed()` - YouTube playback rate (nếu supported)
- `setVolume()` - YouTube volume control

### Event Handling
- Replace HTML5 audio events với YouTube player events
- Handle YouTube player state changes
- Update Media Session API integration

### Compatibility
- Keep existing function signatures
- Maintain compatibility với existing components
- Preserve auto-save position logic
- Keep queue management functions

## Lưu ý
- Minimal refactor, preserve existing interface
- Update only player implementation, not the API
- Handle YouTube-specific limitations (no offline, etc.)
