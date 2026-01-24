/**
 * YouTubeTab Component
 * YouTube search content for tab navigation - Soft Gold theme
 */
import { useSearch } from "../../hooks/useSearch";
import SearchBar from "../search/SearchBar";
import SearchResults from "../search/SearchResults";
import SearchFilters from "../search/SearchFilters";

function YouTubeTab() {
  const {
    query,
    results,
    isLoading,
    error,
    hasSearched,
    inputMode,
    filters,
    viewMode,
    setQuery,
    clearSearch,
    retry,
    handleUrlPaste,
    setFilters,
    resetFilters,
    setViewMode,
  } = useSearch();

  return (
    <div className="youtube-tab">
      {/* Search Bar */}
      <div className="mb-4 sticky top-0 z-10 -mx-4 px-4 py-2 bg-cream-200/95 backdrop-blur-sm">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={clearSearch}
          onUrlPaste={handleUrlPaste}
          isLoading={isLoading}
          inputMode={inputMode}
        />

        {/* Search Filters - show when has searched */}
        {hasSearched && (
          <div className="mt-3">
            <SearchFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={resetFilters}
            />
          </div>
        )}
      </div>

      {/* Quick Categories (only show when not searching) */}
      {!hasSearched && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-cream-900 mb-3">
            Gợi ý tìm kiếm
          </h2>
          <div className="flex gap-2 flex-wrap">
            {[
              "Đắc Nhân Tâm",
              "Nghĩ Giàu Làm Giàu",
              "Nhà Giả Kim",
              "Tuổi Trẻ Đáng Giá Bao Nhiêu",
              "7 Thói Quen",
              "Atomic Habits",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-4 py-2 bg-cream-50 rounded-full text-sm text-cream-700
                           border border-cream-400/50 hover:border-gold-400 hover:bg-gold-50
                           hover:text-gold-700 transition-all duration-200 active:scale-95
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700
                           min-h-[44px]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Search Results */}
      <SearchResults
        results={results}
        isLoading={isLoading}
        error={error}
        hasSearched={hasSearched}
        onRetry={retry}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Tips section (only show when not searching) */}
      {!hasSearched && (
        <section className="mt-6">
          <div
            className="bg-gradient-to-br from-gold-100 to-cream-200 
                          rounded-2xl p-5 border border-gold-300/50 shadow-soft-card"
          >
            <h3 className="text-cream-900 font-semibold mb-2 flex items-center gap-2">
              💡 Mẹo tìm kiếm
            </h3>
            <ul className="text-cream-700 text-sm space-y-1.5">
              <li>• Nhập tên sách hoặc tác giả</li>
              <li>• Dán URL YouTube để phát trực tiếp</li>
              <li>• Thêm "full" để tìm bản đầy đủ</li>
              <li>• Dùng bộ lọc để thu hẹp kết quả</li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default YouTubeTab;
