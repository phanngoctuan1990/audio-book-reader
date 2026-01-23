# Prompt 3: Tạo YouTube Player Component

## Mục tiêu
Tạo file `src/components/player/YouTubePlayer.jsx` với YouTube IFrame player và custom controls.

## Yêu cầu
Tạo file `src/components/player/YouTubePlayer.jsx` với:

### IFrame Container
- Container div cho YouTube IFrame player
- Responsive design
- Hidden YouTube controls (sử dụng custom controls)

### Custom Controls Overlay
- Play/pause button
- Progress bar với seek functionality
- Volume slider
- Time display (current/total)
- Next/previous buttons

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
- Connect với YouTubePlayerContext
- Handle player events và state updates

### Styling
- Minimal UI, focus vào functionality
- Dark theme tương thích với app hiện tại
- Responsive cho mobile/desktop

## Lưu ý
- Component tự contained, không depend vào external state
- Handle loading states
- Error boundaries cho YouTube API failures
