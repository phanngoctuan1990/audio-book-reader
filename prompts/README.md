# 📚 AudioBookReader - Development Prompts v2.0

## 🏗️ **Architecture Status**
**✅ Refactored to modular hook architecture** - 65% code reduction, performance optimized

### **Current Architecture:**
```
src/contexts/PlayerContext.jsx (223 lines) - Main orchestrator
src/hooks/
├── useYouTubePlayerCore.js - Player instance & events  
├── usePlayerQueue.js - Queue, shuffle, repeat
├── usePlayerPersistence.js - localStorage sync
└── usePlayerBackground.js - Media session, wake lock
src/utils/constants.js - All app constants (NO magic numbers)
```

## 📋 **Prompt Status**

### **✅ Updated for v2.0 (Ready to Use)**
1. **01-youtube-service.md** - YouTube API with constants & formatters
2. **02-youtube-player-context.md** - Modular hook architecture  
3. **03-youtube-player-component.md** - Context splitting optimization
4. **04-update-search-hook.md** - Constants integration

### **🚫 Obsolete (Skip These)**
5. **05-update-player-context.md** - Replaced by hook architecture

### **⚠️ Legacy (Work but Not Optimized)**
6. **06-update-api-service.md** - Needs formatters integration
7. **07-update-components.md** - Needs context splitting  
8. **08-environment-config.md** - Still valid ✅
9. **09-testing-cleanup.md** - Needs hook testing patterns

### **✅ Feature Prompts (Compatible)**
- `features/01-07-*.md` - Advanced features work with v2.0
- `UI/COMPLETE_UI_GUIDE.md` - Soft Gold theme compatible

## 🚀 **Recommended Usage**

### **For New Projects:**
1. Use prompts **01-04** (updated for v2.0)
2. Skip prompt **05** (obsolete)
3. Use **feature prompts** for advanced functionality
4. Use **UI prompts** for theming

### **For Existing Projects:**
1. Follow **refactoring guide** in `docs/Refactoring_Report_v2.md`
2. Migrate gradually using hook composition
3. Update constants usage throughout codebase

## 🎯 **Quick Start Patterns**

### **New Hook Creation:**
```javascript
// src/hooks/usePlayerNewFeature.js
export function usePlayerNewFeature(state, actions) {
  // Feature logic using constants
  return featureAPI;
}
```

### **Performance Optimization:**
```javascript
// Use context splitting
const { currentTrack } = useContext(PlayerStateContext); // State
const { play } = useContext(PlayerActionsContext); // Actions
```

### **Constants Usage:**
```javascript
// Always use constants
import { PLAYER_CONFIG } from "../utils/constants";
const interval = PLAYER_CONFIG.TIME_UPDATE_INTERVAL; // Not 250
```

## 📊 **Architecture Benefits**
- ✅ **65% code reduction** (640 → 223 lines)
- ✅ **Performance optimized** (context splitting prevents re-renders)
- ✅ **100% constants** (no magic numbers)
- ✅ **Modular hooks** (independently testable)
- ✅ **Backward compatible** (`usePlayer()` still works)

---

**Use updated prompts for best results!** 🏆
