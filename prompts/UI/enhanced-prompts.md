# Prompt 0: Phân tích Design System (Bổ sung trước Prompt 1)

"Chào AI, tôi sẽ cung cấp hình ảnh thiết kế UI mới cho ứng dụng 'Vibe Audio'. Trước khi bắt đầu implement, hãy phân tích chi tiết design system từ hình ảnh:

## Yêu cầu phân tích:

### 1. Color Palette Analysis:
- Xác định chính xác các màu sắc chính từ hình ảnh
- Đo độ tương phản để đảm bảo accessibility (WCAG 2.1)
- Tạo color variants (50, 100, 200...900) cho mỗi màu chính

### 2. Typography Hierarchy:
- Xác định font sizes cho từng cấp độ (h1, h2, body, caption)
- Font weights được sử dụng
- Line heights và letter spacing

### 3. Spacing System:
- Margins và paddings patterns
- Component spacing consistency
- Grid system (nếu có)

### 4. Component Inventory:
- List tất cả UI components trong design
- Interactive states (hover, active, disabled)
- Animation/transition requirements

### 5. Layout Patterns:
- Screen breakpoints
- Navigation patterns
- Content organization

Hãy đưa ra phân tích chi tiết trước khi chúng ta bắt đầu implement."

---

# Prompt 1.5: Accessibility & Performance (Bổ sung sau Prompt 1)

"Sau khi cập nhật theme, hãy đảm bảo accessibility và performance:

## Accessibility Requirements:

### 1. Color Contrast:
```css
/* Kiểm tra tất cả color combinations */
- bg-cream + text-primary: contrast ratio ≥ 4.5:1
- gold-DEFAULT + white text: contrast ratio ≥ 4.5:1
- text-secondary trên bg-cream: contrast ratio ≥ 3:1
```

### 2. Focus States:
```css
/* Thêm focus-visible styles */
.focus-ring {
  @apply focus-visible:ring-2 focus-visible:ring-gold-DEFAULT focus-visible:ring-offset-2 focus-visible:ring-offset-cream;
}
```

### 3. Screen Reader Support:
- Thêm proper ARIA labels
- Skip navigation links
- Semantic HTML structure

## Performance Optimizations:

### 1. CSS Optimizations:
```css
/* Sử dụng CSS custom properties cho animations */
:root {
  --shadow-soft-3d: 4px 4px 8px #d1c9b8, -4px -4px 8px #ffffff;
  --transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. Font Loading:
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/nunito-variable.woff2" as="font" type="font/woff2" crossorigin>
```

Hãy cập nhật tailwind.config.js với accessibility và performance improvements."

---

# Prompt 2.5: Responsive Design Details (Bổ sung sau Prompt 2)

"Bây giờ hãy chi tiết hóa responsive behavior cho từng breakpoint:

## Mobile First Approach:

### 1. Mobile (375px - 767px):
```javascript
// Bottom Navigation
- Height: 80px (touch-friendly)
- Icons: 24px với 44px touch target
- Labels: Hidden hoặc very small

// Header
- Search bar: Full width với 16px margin
- Filter pills: Horizontal scroll với snap
- Title: 24px font size
```

### 2. Tablet (768px - 1023px):
```javascript
// Navigation
- Có thể show labels dưới icons
- Spacing tăng lên

// Content
- 2-column grid cho BookCards
- Search bar: Max width 400px, centered
- Filter pills: Wrap to multiple lines
```

### 3. Desktop (1024px+):
```javascript
// Layout
- Max width container: 1200px
- Side navigation thay vì bottom nav
- 3-4 column grid cho BookCards
- Hover states cho tất cả interactive elements
```

## Component Responsive Behavior:

### Mini Player:
```css
/* Mobile */
.mini-player {
  @apply h-16 px-4;
}

/* Tablet+ */
@media (min-width: 768px) {
  .mini-player {
    @apply h-20 px-6 max-w-md mx-auto;
  }
}
```

Hãy implement responsive design cho tất cả components."

---

# Prompt 3.5: Animations & Micro-interactions (Bổ sung sau Prompt 3)

"Cuối cùng, thêm animations và micro-interactions để hoàn thiện UX:

## Animation System:

### 1. Transition Classes:
```css
/* Trong tailwind.config.js */
animation: {
  'fade-in': 'fadeIn 0.3s ease-out',
  'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  'bounce-soft': 'bounceSoft 0.6s ease-out',
  'pulse-gold': 'pulseGold 2s infinite',
}
```

### 2. Interactive States:
```javascript
// Button hover/press animations
const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
}

// Card hover effects
const cardVariants = {
  hover: { 
    y: -4, 
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
}
```

### 3. Page Transitions:
```javascript
// Route change animations
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}
```

### 4. Loading States:
```javascript
// Skeleton loaders với gold theme
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-gold-light/30 rounded-xl h-48 mb-3"></div>
    <div className="bg-gold-light/30 rounded h-4 mb-2"></div>
    <div className="bg-gold-light/30 rounded h-3 w-2/3"></div>
  </div>
);
```

### 5. Gesture Support:
```javascript
// Swipe gestures cho mobile
- Swipe left/right trên BookCard: Add to favorites
- Pull to refresh trên danh sách
- Swipe up trên Mini Player: Expand to full player
```

## Micro-interactions:

### 1. Button Feedback:
- Haptic feedback trên mobile (nếu supported)
- Visual feedback với scale animation
- Sound feedback (optional)

### 2. Form Interactions:
- Search bar focus animation
- Filter selection với smooth transition
- Input validation với gentle shake animation

### 3. Player Interactions:
- Play button với ripple effect
- Progress bar với smooth drag
- Volume control với visual feedback

Hãy implement animation system và micro-interactions."

---

# Prompt 4: Testing & Refinement (Prompt mới)

"Sau khi hoàn thành implementation, hãy tạo testing checklist và refinement:

## Visual Testing:

### 1. Cross-browser Testing:
```javascript
// Test trên các browsers
- Chrome (latest)
- Firefox (latest) 
- Safari (iOS + macOS)
- Edge (latest)

// Kiểm tra:
- Font rendering consistency
- Shadow effects
- Color accuracy
- Animation performance
```

### 2. Device Testing:
```javascript
// Mobile devices
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Samsung Galaxy S21 (360px)

// Tablets
- iPad (768px)
- iPad Pro (1024px)

// Desktop
- 1366x768 (common laptop)
- 1920x1080 (desktop)
- 2560x1440 (high-res)
```

### 3. Accessibility Testing:
```javascript
// Tools để test
- axe-core (automated testing)
- WAVE (web accessibility evaluation)
- Screen reader testing (VoiceOver, NVDA)
- Keyboard navigation testing
- Color blindness simulation
```

## Performance Testing:

### 1. Lighthouse Audit:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### 2. Bundle Analysis:
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for:
- Unused CSS classes
- Large font files
- Duplicate dependencies
```

### 3. Runtime Performance:
- Animation frame rate (60fps target)
- Memory usage monitoring
- CPU usage during animations

## Refinement Checklist:

### 1. Visual Polish:
- [ ] Consistent spacing throughout
- [ ] Proper color contrast ratios
- [ ] Smooth animations (no jank)
- [ ] Loading states for all async operations

### 2. Interaction Polish:
- [ ] Touch targets ≥ 44px
- [ ] Hover states on desktop
- [ ] Focus indicators visible
- [ ] Error states handled gracefully

### 3. Content Polish:
- [ ] Typography hierarchy clear
- [ ] Text readability optimized
- [ ] Empty states informative
- [ ] Error messages helpful

Hãy tạo comprehensive testing plan và implement refinements."
