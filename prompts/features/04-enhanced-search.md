# Feature 04: Enhanced Search Features

## 🎯 Mục tiêu
Thêm URL paste support, grid view, và advanced search filters như Music-CLI.

## 📋 Yêu cầu

### 1. Update Search Bar (`src/components/search/SearchBar.jsx`)
```javascript
// Enhanced search input
const SearchBar = ({ value, onChange, onClear, isLoading }) => {
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'url'
  
  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (isYouTubeUrl(pastedText)) {
      setInputMode('url');
      onChange(pastedText);
      // Auto-search when URL pasted
      handleUrlSearch(pastedText);
    }
  };
  
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={inputMode === 'url' ? 'Dán URL YouTube...' : 'Tìm sách nói...'}
      />
      <SearchFilters />
    </div>
  );
};
```

### 2. Tạo Search Filters (`src/components/search/SearchFilters.jsx`)
```javascript
// Advanced search filters
const SearchFilters = ({ filters, onChange }) => {
  const filterOptions = {
    duration: ['Tất cả', 'Dưới 1h', '1-3h', 'Trên 3h'],
    uploadDate: ['Tất cả', 'Hôm nay', 'Tuần này', 'Tháng này', 'Năm này'],
    sortBy: ['Liên quan', 'Ngày tải lên', 'Lượt xem', 'Đánh giá'],
    quality: ['Tất cả', 'HD', 'Chất lượng cao']
  };
  
  return (
    <div className="search-filters">
      <FilterDropdown 
        label="Thời lượng" 
        options={filterOptions.duration}
        value={filters.duration}
        onChange={(value) => onChange('duration', value)}
      />
      <FilterDropdown 
        label="Ngày tải" 
        options={filterOptions.uploadDate}
        value={filters.uploadDate}
        onChange={(value) => onChange('uploadDate', value)}
      />
      <FilterDropdown 
        label="Sắp xếp" 
        options={filterOptions.sortBy}
        value={filters.sortBy}
        onChange={(value) => onChange('sortBy', value)}
      />
    </div>
  );
};
```

### 3. Update Search Results (`src/components/search/SearchResults.jsx`)
```javascript
// Grid view with enhanced layout
const SearchResults = ({ results, viewMode = 'grid' }) => {
  return (
    <div className={`search-results ${viewMode}`}>
      {viewMode === 'grid' ? (
        <div className="results-grid">
          {results.map(result => (
            <SearchResultCard key={result.videoId} result={result} />
          ))}
        </div>
      ) : (
        <div className="results-list">
          {results.map(result => (
            <SearchResultItem key={result.videoId} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### 4. Tạo Search Result Components

#### `src/components/search/SearchResultCard.jsx`
```javascript
// Grid card layout (like Music-CLI)
const SearchResultCard = ({ result, onPlay, onAddToPlaylist }) => {
  return (
    <div className="search-result-card">
      <div className="thumbnail-container">
        <img src={result.thumbnail} alt={result.title} />
        <div className="overlay">
          <button className="play-btn" onClick={() => onPlay(result)}>
            ▶️
          </button>
          <button className="add-btn" onClick={() => onAddToPlaylist(result)}>
            +
          </button>
        </div>
        <span className="duration">{result.duration}</span>
      </div>
      
      <div className="card-info">
        <h3 className="title">{result.title}</h3>
        <p className="author">{result.author}</p>
        <div className="metadata">
          <span className="views">{result.views}</span>
          <span className="upload-date">{result.uploadedDate}</span>
        </div>
      </div>
    </div>
  );
};
```

#### `src/components/search/SearchResultItem.jsx`
```javascript
// List item layout (existing enhanced)
const SearchResultItem = ({ result, onPlay, onAddToPlaylist }) => {
  return (
    <div className="search-result-item">
      <img src={result.thumbnail} className="thumbnail" />
      
      <div className="info">
        <h3 className="title">{result.title}</h3>
        <p className="author">{result.author}</p>
        <div className="metadata">
          <span className="duration">{result.duration}</span>
          <span className="views">{result.views}</span>
          <span className="upload-date">{result.uploadedDate}</span>
        </div>
      </div>
      
      <div className="actions">
        <button className="play-btn" onClick={() => onPlay(result)}>
          ▶️
        </button>
        <button className="add-btn" onClick={() => onAddToPlaylist(result)}>
          +
        </button>
      </div>
    </div>
  );
};
```

### 5. Update Search Hook (`src/hooks/useSearch.js`)
```javascript
// Enhanced search with filters and URL support
export function useSearch() {
  const [filters, setFilters] = useState({
    duration: 'Tất cả',
    uploadDate: 'Tất cả', 
    sortBy: 'Liên quan',
    quality: 'Tất cả'
  });
  const [viewMode, setViewMode] = useState('grid');
  
  // URL detection and handling
  const isYouTubeUrl = (text) => {
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/.test(text);
  };
  
  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };
  
  const searchWithFilters = async (query, searchFilters) => {
    // Apply filters to YouTube API search
    const params = {
      q: query,
      type: 'video',
      videoDuration: mapDurationFilter(searchFilters.duration),
      publishedAfter: mapDateFilter(searchFilters.uploadDate),
      order: mapSortFilter(searchFilters.sortBy)
    };
    
    return await searchApi(params);
  };
  
  return {
    // ... existing returns
    filters,
    setFilters,
    viewMode,
    setViewMode,
    isYouTubeUrl,
    extractVideoId
  };
}
```

### 6. Tạo View Mode Toggle (`src/components/search/ViewModeToggle.jsx`)
```javascript
// Toggle between grid and list view
const ViewModeToggle = ({ mode, onChange }) => {
  return (
    <div className="view-mode-toggle">
      <button 
        className={mode === 'grid' ? 'active' : ''}
        onClick={() => onChange('grid')}
      >
        ⊞ Grid
      </button>
      <button 
        className={mode === 'list' ? 'active' : ''}
        onClick={() => onChange('list')}
      >
        ☰ List
      </button>
    </div>
  );
};
```

## 🎨 UI Requirements

### Grid View Design
- 2-column layout on mobile, 3-4 on desktop
- Card-based design with hover effects
- Thumbnail with overlay controls
- Metadata below thumbnail

### Filter UI
- Collapsible filter panel
- Dropdown selectors
- Clear all filters button
- Active filter indicators

### URL Input Enhancement
- Auto-detect YouTube URLs
- Visual feedback for URL mode
- Instant search on URL paste
- URL validation and error handling

## 🔧 Technical Requirements

### URL Handling
```javascript
// YouTube URL patterns to support
const urlPatterns = [
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  /youtu\.be\/([a-zA-Z0-9_-]+)/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
];
```

### Filter Implementation
- Map UI filters to YouTube API parameters
- Debounced filter application
- Persist filter preferences
- Reset filters functionality

### Performance
- Virtual scrolling for large result sets
- Image lazy loading
- Debounced search with filters
- Cache search results

## 📱 Mobile Optimization
- Touch-friendly grid cards
- Swipe gestures for view mode
- Responsive filter panel
- Optimized thumbnail sizes

## 🧪 Testing Checklist
- [ ] YouTube URL detection works
- [ ] URL paste triggers search
- [ ] Grid view displays correctly
- [ ] List view displays correctly
- [ ] Filters apply to search
- [ ] View mode toggle works
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Error handling for invalid URLs

## 💡 Implementation Notes
- Start with URL detection (highest impact)
- Implement grid view as default
- Add filters progressively
- Use CSS Grid for responsive layout
- Implement infinite scroll for large results
