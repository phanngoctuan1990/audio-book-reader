import { useState, useCallback, useRef } from "react";
import { search as searchApi } from "../services/api";
import { SEARCH_DEBOUNCE } from "../utils/constants";

/**
 * Custom hook for search functionality with debounce
 * @returns {Object} Search state and handlers
 */
export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  /**
   * Perform search with debounce
   * @param {string} searchQuery - Search query
   * @param {boolean} immediate - Skip debounce
   */
  const performSearch = useCallback(async (searchQuery, immediate = false) => {
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
      return;
    }

    const executeSearch = async () => {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      abortControllerRef.current = new AbortController();

      try {
        const data = await searchApi(trimmedQuery);
        setResults(data);
        setError(null);
      } catch (err) {
        // Ignore abort errors
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return;
        }
        setError(err.message || "Không thể tìm kiếm. Vui lòng thử lại.");
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
  }, []);

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
  }, []);

  /**
   * Retry last search
   */
  const retry = useCallback(() => {
    if (query.trim()) {
      performSearch(query, true);
    }
  }, [query, performSearch]);

  return {
    query,
    results,
    isLoading,
    error,
    hasSearched,
    setQuery: handleQueryChange,
    clearSearch,
    retry,
    search: performSearch,
  };
}
