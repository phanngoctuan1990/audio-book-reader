# Prompt 4: Update Search Hook

## Mục tiêu
Sửa file `src/hooks/useSearch.js` để sử dụng YouTube Data API v3 thay vì proxy.

## Yêu cầu
Update file `src/hooks/useSearch.js`:

### API Integration
- Thay thế `searchApi` call bằng YouTube Data API v3
- Sử dụng YouTube service từ prompt 1
- Format response data cho audiobook search

### Search Logic
- Keep existing debounce logic
- Maintain existing state management
- Add prefix "Sách nói" cho audiobook search
- Handle API errors và rate limits

### Response Format
Transform YouTube API response thành format hiện tại:
```javascript
{
  videoId: string,
  title: string,
  author: string,
  thumbnail: string,
  duration: string,
  views: string,
  uploadedDate: string
}
```

### Error Handling
- Handle YouTube API quota exceeded
- Network errors
- Invalid API key
- No results found

### Existing Interface
- Keep all existing functions và props
- Maintain compatibility với components sử dụng hook này
- Preserve debounce behavior

## Lưu ý
- Minimal changes, chỉ thay API calls
- Keep existing hook interface
- Add YouTube API error handling
