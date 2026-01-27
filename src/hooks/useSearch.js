import { useState, useCallback, useRef, useEffect } from "react";
import { searchVideos, getVideoDetails } from "../services/youtube";
import { SEARCH_DEBOUNCE } from "../utils/constants";
import { 
  addToSearchHistory, 
  getSearchHistory, 
  deleteSearchHistory, 
  clearSearchHistory 
} from "../services/db";

// Search prefix for audiobook results
const AUDIOBOOK_PREFIX = "Sách nói";

// YouTube URL patterns
const YOUTUBE_URL_PATTERNS = [
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  /youtu\.be\/([a-zA-Z0-9_-]+)/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
];

// Default filter values
const DEFAULT_FILTERS = {
  duration: "all", // 'all', 'short', 'medium', 'long'
  uploadDate: "all", // 'all', 'today', 'week', 'month', 'year'
  sortBy: "relevance", // 'relevance', 'date', 'viewCount', 'rating'
};

/**
 * Check if text is a YouTube URL
 * @param {string} text - Text to check
 * @returns {boolean} True if YouTube URL
 */
export function isYouTubeUrl(text) {
  if (!text) return false;
  return YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null
 */
export function extractVideoId(url) {
  if (!url) return null;
  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Custom hook for search functionality with debounce
 * Uses YouTube Data API v3 for audiobook search
 * @returns {Object} Search state and handlers
 */
export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [inputMode, setInputMode] = useState("text"); // 'text' | 'url'
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("searchViewMode") || "grid";
  });
  const [history, setHistory] = useState([]);

  // Load search history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const data = await getSearchHistory();
      setHistory(data);
    };
    loadHistory();
  }, []);

  const refreshHistory = useCallback(async () => {
    const data = await getSearchHistory();
    setHistory(data);
  }, []);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  /**
   * Parse YouTube API error and return user-friendly message
   * @param {Error} err - Error object
   * @returns {string} User-friendly error message
   */
  const parseYouTubeError = useCallback((err) => {
    const message = err.message?.toLowerCase() || "";

    // Quota exceeded
    if (message.includes("quota") || message.includes("exceeded")) {
      return "Đã vượt quá giới hạn tìm kiếm. Vui lòng thử lại sau.";
    }

    // Rate limit
    if (message.includes("rate") || message.includes("limit")) {
      return "Quá nhiều yêu cầu. Vui lòng đợi một chút.";
    }

    // API key issues
    if (
      message.includes("api key") ||
      message.includes("forbidden") ||
      message.includes("unauthorized")
    ) {
      return "Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.";
    }

    // Network errors
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed to fetch")
    ) {
      return "Lỗi kết nối mạng. Vui lòng kiểm tra internet.";
    }

    // Generic error
    return "Không thể tìm kiếm. Vui lòng thử lại.";
  }, []);

  /**
   * Search by video ID (for URL paste)
   * @param {string} videoId - YouTube video ID
   */
  const searchByVideoId = useCallback(async (videoId) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setInputMode("url");

    try {
      const details = await getVideoDetails(videoId);

      if (!details) {
        setError("Không tìm thấy video. Kiểm tra lại URL.");
        setResults([]);
        return;
      }

      // Format as search result
      const result = {
        videoId: details.id,
        title: details.title,
        author: details.author,
        thumbnail: details.thumbnail,
        duration: details.duration,
        views: details.viewCount,
        uploadedDate: "",
        description: details.description,
      };

      setResults([result]);
      setError(null);
    } catch (err) {
      setError(parseYouTubeError(err));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle URL paste and auto-search
   * @param {string} url - Pasted URL
   * @returns {boolean} True if URL was handled
   */
  const handleUrlPaste = useCallback(
    (url) => {
      if (!isYouTubeUrl(url)) {
        setInputMode("text");
        return false;
      }

      const videoId = extractVideoId(url);
      if (videoId) {
        setQuery(url);
        searchByVideoId(videoId);
        return true;
      }

      return false;
    },
    [searchByVideoId],
  );

  /**
   * Perform search with debounce
   * @param {string} searchQuery - Search query
   * @param {boolean} immediate - Skip debounce
   */
  const performSearch = useCallback(
    async (searchQuery, immediate = false) => {
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const trimmedQuery = searchQuery.trim();

      // Clear results if query is empty
      if (!trimmedQuery) {
        setResults([]);
        setError(null);
        setHasSearched(false);
        setInputMode("text");
        return;
      }

      // Check if it's a URL
      if (isYouTubeUrl(trimmedQuery)) {
        handleUrlPaste(trimmedQuery);
        return;
      }

      setInputMode("text");

      const executeSearch = async () => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        abortControllerRef.current = new AbortController();

        try {
          // Add audiobook prefix for better results
          const fullQuery = `${AUDIOBOOK_PREFIX} ${trimmedQuery}`;

          // Use YouTube Data API v3 directly with filters
          const data = await searchVideos(fullQuery, 30, filters);

          // Handle no results
          if (!data || data.length === 0) {
            setResults([]);
            setError("Không tìm thấy kết quả. Thử từ khóa khác.");
            return;
          }

          // Client-side filtering for strict duration ranges 
          // (YouTube API ranges are too broad: <4m, 4-20m, >20m)
          const filteredResults = data.filter(item => {
            if (!filters.duration || filters.duration === "all") return true;
            
            // Parse duration "H:MM:SS" or "MM:SS"
            const parts = item.duration.split(':').map(Number);
            let seconds = 0;
            if (parts.length === 3) {
              seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
              seconds = parts[0] * 60 + parts[1];
            } else {
              seconds = parts[0] || 0;
            }

            if (filters.duration === "short") return seconds < 3600; // < 1h
            if (filters.duration === "medium") return seconds >= 3600 && seconds <= 10800; // 1-3h
            if (filters.duration === "long") return seconds > 10800; // > 3h
            return true;
          });

          if (filteredResults.length === 0 && data.length > 0) {
            setError("Không có kết quả phù hợp với bộ lọc hiện tại.");
          }

          setResults(filteredResults);
          setError(null);

          // Save to search history
          await addToSearchHistory(trimmedQuery);
          await refreshHistory();
        } catch (err) {
          // Ignore abort errors
          if (err.name === "AbortError" || err.name === "CanceledError") {
            return;
          }

          // Parse and set user-friendly error
          setError(parseYouTubeError(err));
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      };

      if (immediate) {
        await executeSearch();
      } else {
        debounceTimerRef.current = setTimeout(executeSearch, SEARCH_DEBOUNCE);
      }
    },
    [handleUrlPaste, filters, refreshHistory, parseYouTubeError],
  );

  /**
   * Handle query change with debounced search
   * @param {string} newQuery - New query value
   */
  const handleQueryChange = useCallback(
    (newQuery) => {
      setQuery(newQuery);
      performSearch(newQuery);
    },
    [performSearch],
  );

  // Trigger search when filters change
  useEffect(() => {
    if (query.trim() && hasSearched) {
      performSearch(query, true);
    }
  }, [filters, performSearch, query, hasSearched]);

  /**
   * Update view mode and persist
   * @param {string} mode - 'grid' | 'list'
   */
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem("searchViewMode", mode);
  }, []);

  /**
   * Update filters
   * @param {string} key - Filter key
   * @param {string} value - Filter value
   */
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
    setIsLoading(false);
    setInputMode("text");
  }, []);

  /**
   * Retry last search
   */
  const retry = useCallback(() => {
    if (query.trim()) {
      performSearch(query, true);
    }
  }, [query, performSearch]);

  /**
   * Delete a specific history item
   */
  const handleDeleteHistory = useCallback(async (searchQuery) => {
    await deleteSearchHistory(searchQuery);
    await refreshHistory();
  }, [refreshHistory]);

  /**
   * Clear all search history
   */
  const handleClearHistory = useCallback(async () => {
    await clearSearchHistory();
    setHistory([]);
  }, []);

  return {
    // State
    query,
    results,
    isLoading,
    error,
    hasSearched,
    inputMode,
    filters,
    viewMode,
    // Actions
    setQuery: handleQueryChange,
    clearSearch,
    retry,
    search: performSearch,
    handleUrlPaste,
    setFilters: handleFilterChange,
    resetFilters,
    setViewMode: handleViewModeChange,
    searchHistory: history,
    deleteHistory: handleDeleteHistory,
    clearHistory: handleClearHistory,
    refreshHistory,
    // Utilities
    isYouTubeUrl,
    extractVideoId,
  };
}
