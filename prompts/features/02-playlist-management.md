# Feature 02: Advanced Playlist Management

## 🎯 Mục tiêu
Nâng cấp playlist management với add-to-playlist nhanh, filter, và quản lý nâng cao.

## 📋 Yêu cầu

### 1. Update Search Results (`src/components/search/SearchResults.jsx`)
```javascript
// Add quick add button to each result
<div className="search-result-item">
  <img src={thumbnail} />
  <div className="info">
    <h3>{title}</h3>
    <p>{author}</p>
  </div>
  <button 
    className="add-to-playlist-btn"
    onClick={() => addToPlaylist(track)}
  >
    +
  </button>
</div>
```

### 2. Tạo Playlist Service (`src/services/playlist.js`)
```javascript
// Functions needed
export function createPlaylist(name)
export function getPlaylists()
export function addToPlaylist(playlistId, track)
export function removeFromPlaylist(playlistId, trackId)
export function deletePlaylist(playlistId)
export function searchInPlaylist(playlistId, query)
export function reorderPlaylist(playlistId, fromIndex, toIndex)
```

### 3. Tạo Playlist Context (`src/contexts/PlaylistContext.jsx`)
```javascript
// State management
const initialState = {
  playlists: [],
  currentPlaylist: null,
  isEditing: false,
  searchQuery: ''
};

// Functions needed
- createNewPlaylist(name)
- selectPlaylist(id)
- addTrackToPlaylist(playlistId, track)
- removeTrackFromPlaylist(playlistId, trackId)
- searchPlaylist(query)
- clearAllTracks(playlistId)
- reorderTracks(playlistId, fromIndex, toIndex)
```

### 4. Tạo Playlist Components

#### `src/components/playlist/PlaylistManager.jsx`
- List of user playlists
- Create new playlist button
- Delete playlist functionality
- Playlist metadata (track count, duration)

#### `src/components/playlist/PlaylistEditor.jsx`
- Track list with search/filter
- Remove individual tracks
- "Clear All" button
- Drag & drop reordering
- Track duration display

#### `src/components/playlist/AddToPlaylistModal.jsx`
- Modal popup for adding tracks
- List of existing playlists
- Create new playlist option
- Quick add functionality

#### `src/components/playlist/PlaylistControls.jsx`
- Play entire playlist
- Shuffle playlist
- Repeat playlist options
- Export/share playlist

### 5. Update Library Page (`src/pages/Library.jsx`)
```javascript
// Add playlist management to library
<div className="library-tabs">
  <Tab>Đang nghe</Tab>
  <Tab>Lịch sử</Tab>
  <Tab>Playlist</Tab> {/* Enhanced */}
</div>

<PlaylistManager />
```

## 🎨 UI Requirements

### Playlist List View
- Card-based layout
- Thumbnail grid (first 4 tracks)
- Playlist name and metadata
- Quick actions (play, edit, delete)

### Playlist Editor View
- Search bar for filtering tracks
- Track list with thumbnails
- Drag handles for reordering
- Bulk actions (select all, delete selected)

### Add to Playlist Flow
- Quick "+" button on search results
- Modal with playlist selection
- Toast confirmation
- Create playlist inline

## 🔧 Technical Requirements

### Data Structure
```javascript
// Playlist object
{
  id: string,
  name: string,
  tracks: Track[],
  createdAt: Date,
  updatedAt: Date,
  thumbnail: string, // First track thumbnail
  duration: number, // Total duration
  trackCount: number
}
```

### Storage
- Use IndexedDB via existing db.js service
- Sync with localStorage for quick access
- Export/import functionality
- Backup to cloud (future)

### Performance
- Virtual scrolling for large playlists
- Lazy loading of track metadata
- Debounced search
- Optimistic UI updates

## 📱 Mobile Optimization
- Touch-friendly drag & drop
- Swipe actions (delete, add to queue)
- Pull-to-refresh
- Haptic feedback

## 🧪 Testing Checklist
- [ ] Create playlist works
- [ ] Add tracks to playlist
- [ ] Remove tracks from playlist
- [ ] Search within playlist
- [ ] Clear all tracks
- [ ] Delete entire playlist
- [ ] Drag & drop reordering
- [ ] Play entire playlist
- [ ] Mobile touch interactions

## 💡 Implementation Notes
- Start with basic CRUD operations
- Add drag & drop as enhancement
- Use react-beautiful-dnd for reordering
- Implement undo functionality for deletions
- Add playlist sharing via URL/QR code
