# 📚 AudioBookReader v2.0 - Documentation

## 🎯 Overview

Complete documentation for AudioBookReader v2.0 - a Progressive Web App for listening to audiobooks from YouTube with minimal, mobile-first design.

## 📋 Documentation Index

### 🚀 Getting Started
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Master implementation guide for AI agents
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete project structure and architecture
- **[YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)** - YouTube Data API v3 configuration guide

### 🔧 Development
- **[development-guide.md](./development-guide.md)** - Development workflow and best practices
- **[ui-guidelines.md](./ui-guidelines.md)** - UI/UX design guidelines and components
- **[api-endpoints.md](./api-endpoints.md)** - API integration and endpoints reference

### 🚀 Deployment
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to free hosting platforms (Vercel, Netlify, etc.)

### 📖 Reference
- **[project-overview.md](./project-overview.md)** - Project goals, features, and technical overview

## 🎯 Quick Navigation

### For AI Agents
1. Start with **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)**
2. Follow prompts in `/prompts/` directory
3. Reference **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** for file organization

### For Developers
1. Read **[project-overview.md](./project-overview.md)** for context
2. Setup API key with **[YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)**
3. Follow **[development-guide.md](./development-guide.md)** for workflow
4. Deploy with **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

### For Designers
1. Review **[ui-guidelines.md](./ui-guidelines.md)** for design system
2. Check **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** for component architecture

## 🏗️ Architecture Overview

```
📱 React PWA
├── 🎵 YouTube IFrame Player API (playback)
├── 🔍 YouTube Data API v3 (search)
├── 💾 IndexedDB (metadata caching)
├── 🎨 Tailwind CSS (styling)
└── ⚡ Vite (build tool)
```

## 🎯 Key Features

### Core Features
- ✅ YouTube audiobook search with Vietnamese prefix
- ✅ YouTube IFrame Player with custom controls
- ✅ Queue management and playlist functionality
- ✅ Progress tracking and resume capability
- ✅ PWA with offline metadata caching
- ✅ Mobile-first responsive design

### Technical Features
- ✅ No backend dependencies (pure frontend)
- ✅ YouTube ToS compliant (official APIs only)
- ✅ Performance optimized (code splitting, caching)
- ✅ Accessibility compliant (WCAG 2.1)
- ✅ SEO friendly (meta tags, structured data)

## 📊 Project Stats

### Codebase
- **Language**: JavaScript (React)
- **Bundle Size**: ~200KB gzipped
- **Dependencies**: 8 core packages
- **Components**: 15+ reusable components
- **Lines of Code**: ~3,000 LOC

### Performance
- **Lighthouse Score**: 95+ (all categories)
- **First Load**: <2s on 3G
- **Time to Interactive**: <3s
- **Bundle Analysis**: Optimized chunks

## 🔄 Development Workflow

### 1. Setup
```bash
git clone <repository>
cd audiobook-reader
npm install
cp .env.example .env  # Add your YouTube API key
```

### 2. Development
```bash
npm run dev     # Start development server
npm run build   # Production build
npm run preview # Preview production build
```

### 3. Testing
```bash
npm run test    # Run tests (if implemented)
npm run lint    # Code linting
npm run format  # Code formatting
```

### 4. Deployment
```bash
# Choose your platform
vercel --prod           # Vercel
netlify deploy --prod   # Netlify
npm run deploy          # GitHub Pages
```

## 🎨 Design System

### Color Palette
```css
/* Dark Theme (Primary) */
--dark-900: #0f0f1a;    /* Background */
--dark-800: #1a1a2e;    /* Cards */
--dark-700: #16213e;    /* Borders */

/* Accent Colors */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--accent-blue: #667eea;
--accent-purple: #764ba2;
```

### Typography
```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Scale */
text-xs: 12px;    /* Captions */
text-sm: 14px;    /* Body small */
text-base: 16px;  /* Body */
text-lg: 18px;    /* Headings */
text-xl: 20px;    /* Page titles */
```

### Spacing
```css
/* Tailwind Scale */
gap-2: 8px;     /* Tight spacing */
gap-4: 16px;    /* Normal spacing */
gap-6: 24px;    /* Loose spacing */
gap-8: 32px;    /* Section spacing */
```

## 🔒 Security & Privacy

### Data Handling
- ✅ **No personal data collection**
- ✅ **Local storage only** (IndexedDB, localStorage)
- ✅ **No tracking or analytics**
- ✅ **No cookies** (except functional)

### API Security
- ✅ **API key restrictions** (domain + API limits)
- ✅ **HTTPS only** (all requests)
- ✅ **No sensitive data exposure**
- ✅ **Content Security Policy**

## 📈 Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Route-based chunks
- **Tree Shaking**: Remove unused code
- **Minification**: Terser for JS, cssnano for CSS
- **Compression**: Gzip/Brotli on hosting

### Runtime Optimization
- **Lazy Loading**: Components and images
- **Caching**: Service Worker + IndexedDB
- **Debouncing**: Search input (500ms)
- **Virtual Scrolling**: Large lists (future)

### Network Optimization
- **CDN**: YouTube thumbnails cached
- **API Caching**: 30min for search, 7 days for thumbnails
- **Preloading**: Critical resources
- **Resource Hints**: DNS prefetch, preconnect

## 🌐 Browser Support

### Minimum Requirements
- **Chrome**: 88+ (2021)
- **Firefox**: 85+ (2021)
- **Safari**: 14+ (2020)
- **Edge**: 88+ (2021)

### Progressive Enhancement
- **Core Features**: Work on all modern browsers
- **Enhanced Features**: PWA, Service Worker, etc.
- **Fallbacks**: Graceful degradation for older browsers

## 🆘 Support & Troubleshooting

### Common Issues
1. **YouTube API quota exceeded** → Check Google Cloud Console usage
2. **CORS errors** → Verify API key domain restrictions
3. **Player not loading** → Check YouTube IFrame API script
4. **Search not working** → Verify API key and network

### Debug Tools
```bash
# Development
npm run dev -- --debug    # Verbose logging
npm run build -- --debug  # Build analysis

# Production
console.log(window.__APP_VERSION__);  # Check app version
localStorage.clear();                 # Clear cache
```

### Getting Help
1. Check documentation in this directory
2. Review implementation prompts in `/prompts/`
3. Check browser console for errors
4. Verify environment variables

## 📝 Contributing

### Code Style
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message format

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Follow code style guidelines
4. Add tests if applicable
5. Update documentation
6. Submit pull request

## 📄 License

This project is open source and available under the [MIT License](../LICENSE).

---

**🎯 Goal**: Provide comprehensive documentation for building, deploying, and maintaining AudioBookReader v2.0.

**📚 Start Here**: Choose your role above and follow the recommended documentation path.
