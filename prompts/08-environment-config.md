# Prompt 8: Environment & Config

## Mục tiêu
Setup environment variables và cấu hình cho YouTube API integration.

## Yêu cầu

### 1. Tạo `.env.example`
```
# YouTube Data API v3
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# App Configuration
VITE_APP_NAME=AudioBookReader
VITE_APP_VERSION=2.0.0
```

### 2. Update `.env` (nếu chưa có)
- Add YouTube API key configuration
- Add development/production configs

### 3. Update `vite.config.js` (nếu cần)
- Ensure environment variables được load correctly
- Add any YouTube API specific configurations

### 4. Update `package.json`
- Remove backend-related dependencies
- Add YouTube API related packages (nếu cần)
- Update scripts nếu cần

### 5. Tạo setup instructions
Tạo file `YOUTUBE_API_SETUP.md`:
- Hướng dẫn tạo YouTube Data API key
- Cấu hình API key trong project
- Quota limits và best practices
- Troubleshooting common issues

### 6. Update build configuration
- Ensure YouTube API key được handle correctly trong production
- Add environment validation
- Handle missing API key gracefully

## Environment Variables Needed
```javascript
// In code
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
```

## Lưu ý
- Minimal config changes
- Don't commit actual API keys
- Add validation cho required environment variables
- Document setup process clearly
