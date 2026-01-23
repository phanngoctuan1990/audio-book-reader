# 🚀 Hướng dẫn Deploy AudioBookReader v2.0

## 📋 Tổng quan

AudioBookReader v2.0 là **pure frontend app** không cần backend server, có thể deploy trên bất kỳ static hosting nào.

### ✅ Yêu cầu
- YouTube Data API v3 key
- Static hosting platform
- Domain (optional)

---

## 🆓 Platform Deploy Miễn Phí

### 1. **Vercel** (Khuyến nghị #1)

#### Ưu điểm:
- ✅ **Hoàn toàn miễn phí** cho personal projects
- ✅ **Auto-deploy** từ GitHub
- ✅ **Global CDN** tốc độ cao
- ✅ **Custom domain** miễn phí
- ✅ **Environment variables** support
- ✅ **Analytics** built-in

#### Cách deploy:

**Bước 1: Chuẩn bị**
```bash
# 1. Push code lên GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Tạo production build test
npm run build
npm run preview  # Test local
```

**Bước 2: Deploy trên Vercel**
1. Truy cập [vercel.com](https://vercel.com)
2. Sign up bằng GitHub account
3. Click **"New Project"**
4. Import repository từ GitHub
5. Configure:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

**Bước 3: Environment Variables**
```
VITE_YOUTUBE_API_KEY=your_actual_api_key_here
VITE_APP_NAME=AudioBookReader
VITE_APP_VERSION=2.0.0
```

**Bước 4: Deploy**
- Click **"Deploy"**
- Vercel sẽ auto-build và deploy
- Domain: `your-project.vercel.app`

#### Auto-deploy setup:
```bash
# Mỗi lần push code mới
git push origin main
# → Vercel tự động deploy
```

---

### 2. **Netlify** (Alternative #1)

#### Ưu điểm:
- ✅ **Miễn phí** 100GB bandwidth/month
- ✅ **Drag & drop deploy**
- ✅ **Form handling** (bonus feature)
- ✅ **Split testing** A/B testing

#### Cách deploy:

**Option A: Drag & Drop**
```bash
# 1. Build project
npm run build

# 2. Drag folder 'dist' vào netlify.com
# 3. Done!
```

**Option B: Git Integration**
1. Truy cập [netlify.com](https://netlify.com)
2. **"New site from Git"**
3. Connect GitHub repository
4. Build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
5. Environment variables:
   ```
   VITE_YOUTUBE_API_KEY=your_key
   ```

---

### 3. **GitHub Pages** (Miễn phí hoàn toàn)

#### Ưu điểm:
- ✅ **Hoàn toàn miễn phí**
- ✅ **Unlimited bandwidth**
- ✅ **Custom domain** support
- ❌ Không có environment variables (cần workaround)

#### Cách deploy:

**Bước 1: Install gh-pages**
```bash
npm install --save-dev gh-pages
```

**Bước 2: Update package.json**
```json
{
  "homepage": "https://yourusername.github.io/AudioBookReader",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Bước 3: Workaround cho API key**
```javascript
// src/config/env.js
export const YOUTUBE_API_KEY = 
  import.meta.env.VITE_YOUTUBE_API_KEY || 
  'your_api_key_here'; // Fallback cho GitHub Pages
```

**Bước 4: Deploy**
```bash
npm run deploy
```

**Bước 5: Enable GitHub Pages**
1. GitHub repo → Settings → Pages
2. Source: Deploy from branch `gh-pages`
3. URL: `https://yourusername.github.io/AudioBookReader`

---

### 4. **Firebase Hosting** (Google)

#### Ưu điểm:
- ✅ **Miễn phí** 10GB storage
- ✅ **Global CDN**
- ✅ **Custom domain**
- ✅ **SSL certificate** tự động

#### Cách deploy:

**Bước 1: Setup Firebase**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

**Bước 2: Configure firebase.json**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Bước 3: Deploy**
```bash
npm run build
firebase deploy
```

---

## 🔧 Production Optimization

### 1. **Environment Variables**
```bash
# .env.production
VITE_YOUTUBE_API_KEY=your_production_api_key
VITE_APP_NAME=AudioBookReader
VITE_APP_VERSION=2.0.0
```

### 2. **Build Optimization**
```javascript
// vite.config.js - Production optimizations
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          youtube: ['./src/services/youtube.js']
        }
      }
    }
  }
});
```

### 3. **PWA Optimization**
```javascript
// Service Worker caching
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/www\.googleapis\.com\/youtube\/v3\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "youtube-api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 30 // 30 minutes
        }
      }
    }
  ]
}
```

---

## 🌐 Custom Domain Setup

### Vercel Custom Domain:
1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `yourdomain.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### Netlify Custom Domain:
1. Netlify Dashboard → Site → Domain settings
2. Add custom domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

---

## 📊 So sánh Platforms

| Platform | Miễn phí | Auto-deploy | Custom Domain | Env Vars | CDN |
|----------|----------|-------------|---------------|----------|-----|
| **Vercel** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Netlify** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **GitHub Pages** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Firebase** | ✅ | ❌ | ✅ | ❌ | ✅ |

---

## 🚀 Quick Deploy Commands

### Vercel (Khuyến nghị):
```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy
vercel --prod
```

### Netlify:
```bash
# One-time setup  
npm i -g netlify-cli
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### GitHub Pages:
```bash
npm run deploy
```

---

## 🔒 Security Best Practices

### 1. **API Key Security**
```javascript
// ✅ Restrict API key trong Google Cloud Console
// - HTTP referrers: yourdomain.com/*
// - API restrictions: YouTube Data API v3 only
```

### 2. **Environment Variables**
```bash
# ❌ KHÔNG commit .env files
# ✅ Chỉ commit .env.example
# ✅ Set environment variables trên hosting platform
```

### 3. **HTTPS**
```bash
# ✅ Tất cả platforms đều support HTTPS miễn phí
# ✅ Force HTTPS redirect
```

---

## 🎯 Khuyến nghị

### **Cho beginners**: Vercel
- Setup đơn giản nhất
- Auto-deploy từ GitHub
- Performance tốt nhất

### **Cho advanced users**: Netlify
- Nhiều features hơn
- Form handling
- Edge functions

### **Cho budget = 0**: GitHub Pages
- Hoàn toàn miễn phí
- Unlimited bandwidth
- Cần workaround cho env vars

---

## 📞 Support

Nếu gặp vấn đề deploy:
1. Check build logs trên platform
2. Test local build: `npm run build && npm run preview`
3. Verify environment variables
4. Check API key restrictions

**Happy deploying! 🚀**
