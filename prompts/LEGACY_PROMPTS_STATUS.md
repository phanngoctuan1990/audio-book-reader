# ⚠️ LEGACY PROMPTS - Need Updates for v2.0

## 🚫 Status: NEEDS UPDATES
**These prompts are from v1.0 and need updates for v2.0 architecture.**

## 📋 Legacy Prompts Status:

### **06-update-api-service.md** ⚠️
- **Issue**: Needs formatters integration
- **Fix**: Use `formatters.js` and `errors.js`

### **07-update-components.md** ⚠️  
- **Issue**: Needs context splitting updates
- **Fix**: Use `PlayerStateContext` + `PlayerActionsContext`

### **08-environment-config.md** ✅
- **Status**: Still valid
- **Note**: Environment setup unchanged

### **09-testing-cleanup.md** ⚠️
- **Issue**: Needs hook testing updates  
- **Fix**: Add hook-level testing patterns

## 🔄 Quick Fixes Needed:

### **For 06-update-api-service.md:**
```javascript
// Add to imports:
import { formatYouTubeDuration, formatViewCount } from "../utils/formatters";
import { parseYouTubeError } from "../utils/errors";
```

### **For 07-update-components.md:**
```javascript
// Replace usePlayer() with:
const { currentTrack } = useContext(PlayerStateContext);
const { play, pause } = useContext(PlayerActionsContext);
```

### **For 09-testing-cleanup.md:**
```javascript
// Add hook testing:
describe('usePlayerQueue', () => {
  it('should handle queue operations', () => {
    // Test hook in isolation
  });
});
```

## 🎯 Recommendation:
**Use updated prompts (01-04) and feature prompts instead of these legacy ones.**

---
**These prompts work but are not optimized for v2.0 architecture**
