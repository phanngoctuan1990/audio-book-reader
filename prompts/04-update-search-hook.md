# Search Hook v2.0 - Constants Integration

## 🎯 Objective
Update search hook to use centralized constants and error handling.

## 📋 Implementation

### 1. Update Search Hook
```javascript
// src/hooks/useSearch.js
import { useState, useCallback } from "react";
import { searchVideos } from "../services/youtube";
import { SEARCH_CONFIG, STORAGE_KEYS } from "../utils/constants";
import { parseYouTubeError } from "../utils/errors";
import { durationToSeconds } from "../utils/formatters";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: "relevance",
    duration: "any",
    uploadDate: "any"
  });

  // Load saved view mode
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SEARCH_VIEW_MODE) || "grid";
  });

  const executeSearch = useCallback(async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const videos = await searchVideos(
        searchQuery, 
        SEARCH_CONFIG.MAX_RESULTS, 
        filters
      );

      // Filter by duration if needed
      const filteredVideos = videos.filter(video => {
        if (filters.duration === "any") return true;
        
        const seconds = durationToSeconds(video.duration);
        switch (filters.duration) {
          case "short": return seconds < 240; // < 4 minutes
          case "medium": return seconds >= 240 && seconds < 1200; // 4-20 minutes
          case "long": return seconds >= 1200; // > 20 minutes
          default: return true;
        }
      });

      setResults(filteredVideos);
    } catch (err) {
      setError(parseYouTubeError(err));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  const updateViewMode = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEYS.SEARCH_VIEW_MODE, mode);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    filters,
    setFilters,
    viewMode,
    setViewMode: updateViewMode,
    executeSearch,
    clearSearch,
  };
}
```

### 2. Create Search Filters Component
```javascript
// src/components/search/SearchFilters.jsx
import { SEARCH_CONFIG } from "../../utils/constants";

function SearchFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="search-filters">
      <select 
        value={filters.sortBy} 
        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
      >
        <option value="relevance">Liên quan</option>
        <option value="date">Mới nhất</option>
        <option value="viewCount">Lượt xem</option>
        <option value="rating">Đánh giá</option>
      </select>

      <select 
        value={filters.duration} 
        onChange={(e) => handleFilterChange("duration", e.target.value)}
      >
        <option value="any">Mọi độ dài</option>
        <option value="short">Ngắn (&lt; 4 phút)</option>
        <option value="medium">Trung bình (4-20 phút)</option>
        <option value="long">Dài (&gt; 20 phút)</option>
      </select>

      <select 
        value={filters.uploadDate} 
        onChange={(e) => handleFilterChange("uploadDate", e.target.value)}
      >
        <option value="any">Mọi thời gian</option>
        <option value="today">Hôm nay</option>
        <option value="week">Tuần này</option>
        <option value="month">Tháng này</option>
        <option value="year">Năm này</option>
      </select>
    </div>
  );
}

export default SearchFilters;
```

## ✅ Key Changes from v1.0
- **Constants**: Uses `SEARCH_CONFIG.MAX_RESULTS` instead of magic number
- **Storage**: Uses `STORAGE_KEYS.SEARCH_VIEW_MODE` for persistence
- **Error Handling**: Uses centralized `parseYouTubeError()`
- **Formatters**: Uses `durationToSeconds()` utility function

## 🔄 Migration Notes
- Import constants from `constants.js`
- Import error handler from `errors.js`
- Import formatters from `formatters.js`
- All localStorage keys use `STORAGE_KEYS`
