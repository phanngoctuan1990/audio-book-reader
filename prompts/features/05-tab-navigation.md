# Feature 05: Tab Navigation System

## 🎯 Mục tiêu
Thêm tab navigation giữa YouTube và Radio modes như Music-CLI.

## 📋 Yêu cầu

### 1. Tạo Tab Navigation Component (`src/components/navigation/TabNavigation.jsx`)
```javascript
// Main tab switcher
const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'youtube', label: 'YouTube', icon: '🎵' },
    { id: 'radio', label: 'Radio', icon: '📻' }
  ];
  
  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
```

### 2. Update Home Page (`src/pages/Home.jsx`)
```javascript
// Enhanced Home with tab system
function Home() {
  const [activeTab, setActiveTab] = useState('youtube');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'youtube':
        return <YouTubeTab />;
      case 'radio':
        return <RadioTab />;
      default:
        return <YouTubeTab />;
    }
  };
  
  return (
    <div className="home-page">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          🎧 Vibe Audio
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Nghe sách nói và radio miễn phí
        </p>
      </header>
      
      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
```

### 3. Tạo YouTube Tab (`src/components/tabs/YouTubeTab.jsx`)
```javascript
// YouTube content (existing search functionality)
const YouTubeTab = () => {
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
    <div className="youtube-tab">
      {/* Search Bar */}
      <div className="search-section">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={clearSearch}
          isLoading={isLoading}
        />
      </div>
      
      {/* Quick Categories (when not searching) */}
      {!hasSearched && (
        <QuickCategories onCategorySelect={setQuery} />
      )}
      
      {/* Search Results */}
      <SearchResults 
        results={results}
        isLoading={isLoading}
        error={error}
        hasSearched={hasSearched}
        onRetry={retry}
      />
    </div>
  );
};
```

### 4. Tạo Radio Tab (`src/components/tabs/RadioTab.jsx`)
```javascript
// Radio content (from Feature 01)
const RadioTab = () => {
  const { 
    stations, 
    selectedGenre, 
    selectedMood,
    currentStation,
    isPlaying 
  } = useRadio();
  
  return (
    <div className="radio-tab">
      {/* Radio Filters */}
      <RadioFilters 
        selectedGenre={selectedGenre}
        selectedMood={selectedMood}
        onGenreChange={setGenreFilter}
        onMoodChange={setMoodFilter}
      />
      
      {/* Featured Stations */}
      <section className="featured-stations">
        <h2 className="section-title">Đài phổ biến</h2>
        <FeaturedStations stations={getFeaturedStations()} />
      </section>
      
      {/* Station List */}
      <RadioStationList 
        stations={stations}
        currentStation={currentStation}
        onStationSelect={playStation}
      />
    </div>
  );
};
```

### 5. Tạo Tab Context (`src/contexts/TabContext.jsx`)
```javascript
// Global tab state management
const TabContext = createContext();

const initialState = {
  activeTab: 'youtube',
  tabHistory: ['youtube'],
  tabData: {
    youtube: { lastQuery: '', scrollPosition: 0 },
    radio: { lastGenre: null, lastMood: null }
  }
};

export function TabProvider({ children }) {
  const [state, dispatch] = useReducer(tabReducer, initialState);
  
  const switchTab = (tabId) => {
    // Save current tab state
    saveTabState(state.activeTab);
    
    // Switch to new tab
    dispatch({ type: 'SWITCH_TAB', payload: tabId });
    
    // Restore tab state
    restoreTabState(tabId);
  };
  
  const saveTabState = (tabId) => {
    // Save scroll position, search query, etc.
    const tabElement = document.querySelector(`[data-tab="${tabId}"]`);
    if (tabElement) {
      dispatch({
        type: 'SAVE_TAB_STATE',
        payload: {
          tabId,
          scrollPosition: tabElement.scrollTop,
          // ... other state
        }
      });
    }
  };
  
  return (
    <TabContext.Provider value={{ ...state, switchTab }}>
      {children}
    </TabContext.Provider>
  );
}
```

### 6. Update App Structure (`src/App.jsx`)
```javascript
// Integrate tab system
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  
  return (
    <ToastProvider>
      <PlayerProvider>
        <TabProvider>
          <div className="min-h-screen bg-dark-900 pb-32">
            <main className="pt-safe">
              {renderPage()}
            </main>
            
            <MiniPlayer />
            <BottomNav 
              currentPage={currentPage} 
              onNavigate={setCurrentPage} 
            />
          </div>
        </TabProvider>
      </PlayerProvider>
    </ToastProvider>
  );
}
```

## 🎨 UI Requirements

### Tab Design
- Clean, minimal tab buttons
- Active state with gradient
- Smooth transitions between tabs
- Icons + labels for clarity

### Tab Content
- Consistent padding and spacing
- Smooth content transitions
- Preserve scroll positions
- Loading states per tab

### Animation
- Slide transitions between tabs
- Fade in/out effects
- Smooth tab indicator movement
- Performance optimized

## 🔧 Technical Requirements

### State Management
- Preserve tab state when switching
- Save scroll positions
- Cache tab content
- Handle deep linking

### Performance
- Lazy load tab content
- Virtual scrolling for long lists
- Debounced tab switching
- Memory management

### Navigation
```javascript
// URL structure
/home#youtube
/home#radio
/home#youtube?q=search-term
/home#radio?genre=chill
```

## 📱 Mobile Optimization
- Touch-friendly tab buttons
- Swipe gestures between tabs
- Responsive tab layout
- Haptic feedback

## 🧪 Testing Checklist
- [ ] Tab switching works smoothly
- [ ] State preserved between tabs
- [ ] Scroll positions maintained
- [ ] Deep linking works
- [ ] Mobile swipe gestures
- [ ] Performance acceptable
- [ ] Memory usage reasonable
- [ ] Animations smooth

## 💡 Implementation Notes
- Start with basic tab switching
- Add state preservation as enhancement
- Implement swipe gestures for mobile
- Use CSS transforms for smooth animations
- Consider preloading adjacent tab content
