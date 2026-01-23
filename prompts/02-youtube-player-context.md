# Prompt 2: Tạo YouTube Player Context

## Mục tiêu
Tạo file `src/contexts/YouTubePlayerContext.jsx` thay thế PlayerContext hiện tại.

## Yêu cầu
Tạo file `src/contexts/YouTubePlayerContext.jsx` với:

### State Management
- `currentTrack` - Track đang phát
- `isPlaying` - Trạng thái phát
- `isLoading` - Trạng thái loading
- `currentTime` - Thời gian hiện tại
- `duration` - Tổng thời lượng
- `volume` - Âm lượng
- `queue` - Danh sách phát
- `queueIndex` - Vị trí trong queue

### Core Functions
- `loadTrack(track)` - Load track mới
- `play()` - Phát
- `pause()` - Tạm dừng
- `toggle()` - Toggle play/pause
- `seek(time)` - Tua đến vị trí
- `setVolume(volume)` - Điều chỉnh âm lượng

### Queue Management
- `setQueue(tracks, startIndex)` - Set danh sách phát
- `playNext()` - Phát bài tiếp theo
- `playPrevious()` - Phát bài trước
- `addToQueue(track)` - Thêm vào queue

### Integration
- Sử dụng YouTube service từ prompt 1
- Handle YouTube player events
- Maintain compatibility với existing components

## Lưu ý
- Minimal implementation, chỉ core functionality
- Keep existing state structure để tương thích
- Error handling cơ bản
