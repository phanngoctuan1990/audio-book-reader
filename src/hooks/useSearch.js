import { useState, useCallback, useRef, useEffect } from "react";
import { searchVideos, getVideoDetails } from "../services/youtube";
import {
  SEARCH_DEBOUNCE,
  SEARCH_PREFIX,
  SEARCH_MAX_RESULTS,
  STORAGE_KEYS,
} from "../utils/constants";
import {
  addToSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
} from "../services/db";
import { durationToSeconds } from "../utils/formatters";
import { parseYouTubeError } from "../utils/errors";

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
    return localStorage.getItem(STORAGE_KEYS.SEARCH_VIEW_MODE) || "grid";
  });
  const [history, setHistory] = useState([]);

  // Use a ref to track the latest filters for use in async search
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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
          const fullQuery = `${SEARCH_PREFIX} ${trimmedQuery}`;

          // Get latest filters from ref to avoid closure issues
          const currentFilters = filtersRef.current;

          // Use YouTube Data API v3 directly with filters
          const data = await searchVideos(
            fullQuery,
            SEARCH_MAX_RESULTS,
            currentFilters,
          );

          // Handle no results
          if (!data || data.length === 0) {
            setResults([]);
            setError("Không tìm thấy kết quả. Thử từ khóa khác.");
            return;
          }

          // Client-side filtering for strict duration ranges
          const filteredResults = data.filter((item) => {
            if (!currentFilters.duration || currentFilters.duration === "all")
              return true;

            // Skip items with no duration if we are filtering by duration
            if (!item.duration) return false;

            const seconds = durationToSeconds(item.duration);
            if (seconds === 0) return false;

            if (currentFilters.duration === "short") return seconds < 3600; // < 1h
            if (currentFilters.duration === "medium")
              return seconds >= 3600 && seconds <= 10800; // 1-3h
            if (currentFilters.duration === "long") return seconds > 10800; // > 3h
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
    [handleUrlPaste, refreshHistory],
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
    localStorage.setItem(STORAGE_KEYS.SEARCH_VIEW_MODE, mode);
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
  const handleDeleteHistory = useCallback(
    async (searchQuery) => {
      await deleteSearchHistory(searchQuery);
      await refreshHistory();
    },
    [refreshHistory],
  );

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
