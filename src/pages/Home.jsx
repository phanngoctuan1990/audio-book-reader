import { useSearch } from '../hooks/useSearch';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';

function Home() {
  const { 
    query, 
    results, 
    isLoading, 
    error, 
    hasSearched,
    setQuery, 
    clearSearch,
    retry 
  } = useSearch();

  return (
    <div className="px-4 py-6 pb-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          🎧 Vibe Audio
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Nghe sách nói miễn phí, không quảng cáo
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-4 sticky top-0 z-10 -mx-4 px-4 py-2 bg-dark-900/95 backdrop-blur-sm">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={clearSearch}
          isLoading={isLoading}
        />
      </div>

      {/* Quick Categories (only show when not searching) */}
      {!hasSearched && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Gợi ý tìm kiếm</h2>
          <div className="flex gap-2 flex-wrap">
            {[
              'Đắc Nhân Tâm',
              'Nghĩ Giàu Làm Giàu',
              'Nhà Giả Kim',
              'Tuổi Trẻ Đáng Giá Bao Nhiêu',
              '7 Thói Quen',
              'Atomic Habits',
            ].map(suggestion => (
              <button 
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-4 py-2 bg-dark-700 rounded-full text-sm text-white/80
                           border border-white/10 hover:border-primary/50 hover:bg-dark-600
                           transition-all duration-200 active:scale-95"
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
      />

      {/* Tips section (only show when not searching) */}
      {!hasSearched && (
        <section className="mt-6">
          <div className="bg-gradient-to-br from-primary/20 to-accent-purple/20 
                          rounded-2xl p-5 border border-primary/30">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              💡 Mẹo tìm kiếm
            </h3>
            <ul className="text-white/70 text-sm space-y-1.5">
              <li>• Nhập tên sách hoặc tác giả</li>
              <li>• Thêm "full" để tìm bản đầy đủ</li>
              <li>• Tự động thêm "Sách nói" vào tìm kiếm</li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
