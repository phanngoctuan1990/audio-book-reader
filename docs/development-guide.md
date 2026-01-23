# 🔧 Development Guide

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd AudioBookReader
npm install
```

### 2. Install yt-dlp
```bash
# macOS
brew install yt-dlp

# Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Windows
winget install yt-dlp
```

### 3. Start Development
```bash
# Terminal 1: Backend
node yt-proxy.js

# Terminal 2: Frontend
npm run dev
```

### 4. Open Browser
```
http://localhost:5173
```

---

## 📁 Project Structure

```
AudioBookReader/
├── src/
│   ├── components/       # React components
│   ├── contexts/         # Global state
│   ├── services/         # API & DB
│   ├── utils/            # Helpers
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── prompts/              # Documentation
├── yt-proxy.js           # Backend server
├── package.json          # Dependencies
├── vite.config.js        # Build config
└── tailwind.config.js    # Styling config
```

---

## 🛠️ Development Tools

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **ESLint**
- **Prettier**
- **Auto Rename Tag**

### Browser Extensions
- **React Developer Tools**
- **Redux DevTools** (if using Redux)

---

## 📝 Code Style

### JavaScript/React
```javascript
// Use arrow functions
const MyComponent = () => {
  return <div>Content</div>;
};

// Destructure props
const SearchBar = ({ value, onChange }) => {
  // ...
};

// Use const/let, not var
const API_URL = 'http://localhost:3000';
let counter = 0;
```

### Naming Conventions
```javascript
// Components: PascalCase
const SearchResults = () => {};

// Functions: camelCase
const handleSearch = () => {};

// Constants: UPPER_SNAKE_CASE
const API_TIMEOUT = 5000;

// Files: kebab-case or PascalCase
search-results.jsx
SearchResults.jsx
```

### File Organization
```javascript
// 1. Imports
import React from 'react';
import { useState } from 'react';

// 2. Constants
const MAX_RESULTS = 20;

// 3. Component
const MyComponent = () => {
  // 3.1. State
  const [data, setData] = useState([]);
  
  // 3.2. Effects
  useEffect(() => {}, []);
  
  // 3.3. Handlers
  const handleClick = () => {};
  
  // 3.4. Render
  return <div>...</div>;
};

// 4. Export
export default MyComponent;
```

---

## 🧪 Testing

### Manual Testing Checklist

**Search:**
- [ ] Search returns results
- [ ] Empty search shows message
- [ ] Loading state shows
- [ ] Error handling works

**Player:**
- [ ] Audio plays
- [ ] Pause/resume works
- [ ] Seek works
- [ ] Speed control works
- [ ] Progress saves

**UI:**
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Dark mode looks good
- [ ] Animations smooth

### Test Commands
```bash
# Lint
npm run lint

# Build
npm run build

# Preview build
npm run preview
```

---

## 🐛 Debugging

### Frontend Debugging

**Console Logs:**
```javascript
console.log('[Component] State:', state);
console.error('[API] Error:', error);
```

**React DevTools:**
1. Open DevTools (F12)
2. Go to "Components" tab
3. Inspect component state/props

**Network Tab:**
1. Open DevTools (F12)
2. Go to "Network" tab
3. Check API requests

### Backend Debugging

**Server Logs:**
```javascript
console.log(`[Server] Request: ${req.method} ${req.url}`);
console.error(`[Error] ${error.message}`);
```

**Test Endpoints:**
```bash
# Health
curl http://localhost:3000/health

# Search
curl "http://localhost:3000/api/search?q=test"

# Stream
curl -I "http://localhost:3000/stream/VIDEO_ID"
```

---

## 🔄 Git Workflow

### Branch Strategy
```bash
main          # Production
└── develop   # Development
    ├── feature/search-ui
    ├── feature/player
    └── fix/audio-bug
```

### Commit Messages
```bash
# Format: <type>: <description>

feat: Add search functionality
fix: Fix audio playback bug
docs: Update README
style: Format code
refactor: Refactor API service
test: Add search tests
chore: Update dependencies
```

### Common Commands
```bash
# Create branch
git checkout -b feature/new-feature

# Commit
git add .
git commit -m "feat: Add new feature"

# Push
git push origin feature/new-feature

# Merge to main
git checkout main
git merge feature/new-feature
git push origin main
```

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "express": "^5.2.1",           // Web server
  "cors": "^2.8.5",              // CORS support
  "youtube-search-api": "^2.0.1", // Search
  "idb": "^8.0.0",               // IndexedDB
  "react": "^18.2.0",            // UI library
  "react-dom": "^18.2.0"         // React DOM
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.0",  // Vite React plugin
  "tailwindcss": "^3.3.0",           // CSS framework
  "autoprefixer": "^10.4.16",        // CSS prefixer
  "postcss": "^8.4.32",              // CSS processor
  "vite": "^5.0.0"                   // Build tool
}
```

### Adding Dependencies
```bash
# Production
npm install package-name

# Development
npm install -D package-name

# Remove
npm uninstall package-name
```

---

## 🎨 Styling

### Tailwind CSS
```jsx
// Use utility classes
<div className="flex items-center gap-4 p-4 bg-dark-800 rounded-xl">
  <img className="w-12 h-12 rounded-lg" />
  <div className="flex-1 min-w-0">
    <h3 className="font-medium text-white truncate">Title</h3>
  </div>
</div>
```

### Custom Styles (if needed)
```css
/* src/index.css */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-gradient-primary text-white rounded-xl;
  }
}
```

---

## 🔧 Configuration Files

### vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});
```

### tailwind.config.js
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        dark: {
          900: '#0F0F0F',
          800: '#1A1A1A',
          700: '#262626'
        }
      }
    }
  }
};
```

---

## 🚀 Build & Deploy

### Build for Production
```bash
# Build frontend
npm run build

# Preview build
npm run preview

# Test backend
node yt-proxy.js
```

### Deploy
See `deployment-guide.md` for full instructions.

---

## 📚 Resources

### Documentation
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express Docs](https://expressjs.com)

### Tools
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [youtube-search-api](https://www.npmjs.com/package/youtube-search-api)

---

## 💡 Tips & Tricks

### Performance
- Use React.memo for expensive components
- Lazy load images
- Debounce search input
- Cache API responses

### Code Quality
- Keep components small (<200 lines)
- Extract reusable logic to hooks
- Use TypeScript (optional)
- Write meaningful comments

### Debugging
- Use React DevTools
- Check Network tab
- Read error messages carefully
- Search error on Google/Stack Overflow

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📞 Support

- GitHub Issues: Report bugs
- Discussions: Ask questions
- Email: your-email@example.com
