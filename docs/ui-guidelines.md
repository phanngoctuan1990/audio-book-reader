# 🎨 UI/UX Guidelines

## 🎯 Design Philosophy

- **Dark Mode First** - Tối ưu cho việc đọc/nghe lâu dài
- **Minimalist** - Tập trung vào nội dung
- **Mobile First** - Responsive trên mọi thiết bị
- **Accessible** - Dễ sử dụng cho mọi người

---

## 🎨 Color Palette

### Primary Colors
```css
--primary: #8B5CF6        /* Purple - Main brand */
--primary-dark: #7C3AED   /* Darker purple */
--primary-light: #A78BFA  /* Lighter purple */
```

### Background Colors
```css
--dark-900: #0F0F0F       /* Main background */
--dark-800: #1A1A1A       /* Card background */
--dark-700: #262626       /* Hover state */
```

### Text Colors
```css
--text-primary: #FFFFFF   /* Main text */
--text-secondary: rgba(255,255,255,0.6)  /* Secondary text */
--text-tertiary: rgba(255,255,255,0.4)   /* Tertiary text */
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)
```

---

## 📐 Spacing System

```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
```

---

## 🔤 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
             sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

## 🧩 Components

### Button Styles

**Primary Button:**
```jsx
<button className="
  px-6 py-3 
  bg-gradient-primary 
  text-white font-medium 
  rounded-xl 
  active:scale-95 
  transition-transform
">
  Button Text
</button>
```

**Secondary Button:**
```jsx
<button className="
  px-6 py-3 
  bg-white/10 
  text-white font-medium 
  rounded-xl 
  hover:bg-white/20 
  transition-colors
">
  Button Text
</button>
```

### Card Styles

**Default Card:**
```jsx
<div className="
  bg-dark-800 
  rounded-2xl 
  p-6 
  border border-white/5
">
  Card Content
</div>
```

**Interactive Card:**
```jsx
<div className="
  bg-dark-800 
  rounded-2xl 
  p-4 
  hover:bg-dark-700 
  active:scale-[0.98] 
  transition-all 
  cursor-pointer
">
  Card Content
</div>
```

### Input Styles

**Search Input:**
```jsx
<input className="
  w-full 
  px-6 py-4 
  bg-dark-800 
  text-white 
  rounded-2xl 
  border border-white/10 
  focus:border-primary 
  focus:outline-none 
  transition-colors
" />
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## 🎭 Animations

### Transitions
```css
/* Fast */
transition: all 0.15s ease;

/* Normal */
transition: all 0.2s ease;

/* Slow */
transition: all 0.3s ease;
```

### Hover Effects
```css
/* Scale */
hover:scale-105

/* Opacity */
hover:opacity-80

/* Background */
hover:bg-dark-700
```

### Active Effects
```css
/* Scale down */
active:scale-95

/* Opacity */
active:opacity-70
```

---

## 🎯 Component Examples

### Search Bar
```jsx
<div className="relative">
  <input 
    type="text"
    placeholder="Tìm sách nói..."
    className="w-full px-6 py-4 pl-14 bg-dark-800 text-white 
               rounded-2xl border border-white/10 
               focus:border-primary focus:outline-none"
  />
  <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 
                         w-5 h-5 text-white/40" />
</div>
```

### Audio Book Card
```jsx
<div className="flex items-start gap-3 p-3 bg-dark-800 
                rounded-xl hover:bg-dark-700 transition-colors">
  <img 
    src={thumbnail} 
    className="w-20 h-20 rounded-lg object-cover"
  />
  <div className="flex-1 min-w-0">
    <h3 className="font-medium text-white line-clamp-2">
      {title}
    </h3>
    <p className="text-sm text-white/60 mt-1">
      {author}
    </p>
    <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
      <span>{duration}</span>
      <span>•</span>
      <span>{fileSize}</span>
    </div>
  </div>
</div>
```

### Mini Player
```jsx
<div className="fixed bottom-0 left-0 right-0 
                bg-dark-800 border-t border-white/10 
                p-4 backdrop-blur-lg">
  <div className="flex items-center gap-4">
    <img src={thumbnail} className="w-12 h-12 rounded-lg" />
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-white truncate">{title}</h4>
      <p className="text-sm text-white/60 truncate">{author}</p>
    </div>
    <button className="w-12 h-12 rounded-full bg-primary 
                       flex items-center justify-center">
      <PlayIcon className="w-5 h-5 text-white" />
    </button>
  </div>
</div>
```

---

## ♿ Accessibility

### Focus States
```css
/* Always show focus outline */
focus:outline-none 
focus:ring-2 
focus:ring-primary 
focus:ring-offset-2 
focus:ring-offset-dark-900
```

### ARIA Labels
```jsx
<button aria-label="Play audio">
  <PlayIcon />
</button>

<input 
  type="text" 
  aria-label="Search audiobooks"
  placeholder="Tìm sách nói..."
/>
```

### Keyboard Navigation
- Tab: Navigate between elements
- Enter/Space: Activate buttons
- Arrow keys: Seek audio
- Escape: Close modals

---

## 📐 Layout Guidelines

### Container Widths
```css
/* Mobile */
max-width: 100%;
padding: 0 1rem;

/* Desktop */
max-width: 1200px;
margin: 0 auto;
padding: 0 2rem;
```

### Grid System
```jsx
/* Search Results */
<div className="grid grid-cols-1 gap-2">
  {/* Cards */}
</div>

/* Library Grid */
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>
```

---

## 🎨 Icon System

**Icon Library**: Heroicons (outline & solid)

**Icon Sizes:**
```css
--icon-xs: 1rem      /* 16px */
--icon-sm: 1.25rem   /* 20px */
--icon-md: 1.5rem    /* 24px */
--icon-lg: 2rem      /* 32px */
```

**Usage:**
```jsx
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

<PlayIcon className="w-5 h-5 text-white" />
```

---

## 🌟 Best Practices

1. **Always use Tailwind classes** - Avoid custom CSS
2. **Mobile first** - Design for mobile, enhance for desktop
3. **Dark mode only** - No light mode needed
4. **Consistent spacing** - Use spacing system
5. **Smooth transitions** - Add transitions to interactive elements
6. **Loading states** - Show skeletons while loading
7. **Error states** - Clear error messages
8. **Empty states** - Helpful empty state messages
