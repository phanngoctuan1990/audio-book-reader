# Prompt 1: Tạo YouTube Service

## Mục tiêu
Tạo file `src/services/youtube.js` implement YouTube IFrame Player API và YouTube Data API v3 search.

## Yêu cầu
Tạo file `src/services/youtube.js` với các functions:

### Core Functions
- `loadYouTubeAPI()` - Load YouTube IFrame Player API
- `createPlayer(containerId, videoId, options)` - Tạo YouTube player instance
- `searchVideos(query)` - Search videos qua YouTube Data API v3
- `getVideoDetails(videoId)` - Lấy chi tiết video

### Player Controls
- `playVideo()` - Phát video
- `pauseVideo()` - Tạm dừng
- `seekTo(seconds)` - Tua đến vị trí
- `setVolume(volume)` - Điều chỉnh âm lượng
- `getCurrentTime()` - Lấy thời gian hiện tại
- `getDuration()` - Lấy tổng thời lượng

### Event Handlers
- `onPlayerReady` - Khi player sẵn sàng
- `onPlayerStateChange` - Khi trạng thái thay đổi
- `onPlayerError` - Khi có lỗi

## Lưu ý
- Sử dụng minimal code, chỉ essential functions
- Handle API key từ environment variables
- Error handling cơ bản
- Export các functions để sử dụng trong components
