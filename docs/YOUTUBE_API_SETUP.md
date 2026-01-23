# 🎬 Hướng dẫn cấu hình YouTube API Key

## 📋 Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google
3. Click **"Select a project"** > **"New Project"**
4. Đặt tên project (ví dụ: "AudioBookReader")
5. Click **"Create"**

## 📋 Bước 2: Bật YouTube Data API v3

1. Vào **APIs & Services** > **Library**
2. Tìm kiếm **"YouTube Data API v3"**
3. Click vào kết quả và nhấn **"Enable"**

## 📋 Bước 3: Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **"API key"**
3. Copy API key vừa tạo
4. *(Khuyến nghị)* Click **"Restrict key"** để giới hạn:
   - **API restrictions**: Chỉ cho phép YouTube Data API v3
   - **Application restrictions**: HTTP referrers (chỉ domain của bạn)

## 📋 Bước 4: Cấu hình trong Project

1. Tạo file `.env` trong thư mục gốc project (copy từ `.env.example`)
2. Thay thế `your_youtube_api_key_here` bằng API key của bạn:

```env
VITE_YOUTUBE_API_KEY=AIzaSy...your_actual_key...
VITE_APP_NAME=AudioBookReader
VITE_APP_VERSION=2.0.0
```

3. Restart development server: `npm run dev`

## ⚠️ Quota Limits

YouTube Data API v3 có giới hạn quota mặc định:

| Thao tác | Quota Cost |
|----------|------------|
| Search | 100 units |
| Videos list | 1 unit |
| **Daily limit** | **10,000 units** |

### Tính toán ước lượng:
- Mỗi lần search = 100 units
- ~100 searches/day với quota mặc định
- Mỗi search kèm video details = ~101 units

### Cách tăng quota:
1. Vào **APIs & Services** > **Quotas**
2. Request quota increase (cần giải thích use case)

## 🔧 Troubleshooting

### Lỗi "API key not valid"
- Kiểm tra đã copy đúng API key
- Đảm bảo đã restart dev server sau khi thêm `.env`
- Kiểm tra API key không bị restrict sai domain

### Lỗi "Quota exceeded"
- Đã hết quota hàng ngày
- Chờ đến 00:00 PT (Pacific Time) để reset
- Hoặc request tăng quota

### Lỗi "Access not configured"
- YouTube Data API v3 chưa được enable
- Vào APIs & Services > Library và enable lại

## 🔒 Bảo mật

- **KHÔNG** commit file `.env` lên Git
- Đã có trong `.gitignore`: `.env`, `.env.local`, `.env.*.local`
- Chỉ sử dụng API key trong client-side code khi đã restrict đúng cách
- Trong production, cân nhắc sử dụng proxy server để ẩn API key

## 📚 Tài liệu tham khảo

- [YouTube Data API v3 Overview](https://developers.google.com/youtube/v3/getting-started)
- [API Reference](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
