# Feature 01: Radio Streaming Mode

## 🎯 Mục tiêu
Thêm chế độ Radio streaming như Music-CLI với filter theo thể loại và tâm trạng.

## 📋 Yêu cầu

### 1. Tạo Radio Service (`src/services/radio.js`)
```javascript
// Radio stations data
const RADIO_STATIONS = {
  genres: {
    'chill': [
      { name: 'SomaFM Groove Salad', url: 'https://somafm.com/groovesalad.pls' },
      { name: 'ChillHop Radio', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' }
    ],
    'lofi': [
      { name: 'LoFi Hip Hop Radio', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' }
    ],
    'jazz': [
      { name: 'SomaFM Jazz', url: 'https://somafm.com/jazz.pls' }
    ]
  },
  moods: {
    'focus': ['SomaFM Drone Zone', 'Ambient Radio'],
    'happy': ['Pop Radio', 'Dance Radio'],
    'relaxing': ['Chill Radio', 'Nature Sounds']
  }
};

// Functions needed
export function getStationsByGenre(genre)
export function getStationsByMood(mood)  
export function getAllStations()
export function playStation(stationUrl)
```

### 2. Tạo Radio Context (`src/contexts/RadioContext.jsx`)
```javascript
// State management
const initialState = {
  currentStation: null,
  isPlaying: false,
  selectedGenre: null,
  selectedMood: null,
  stations: [],
  volume: 1
};

// Functions needed
- loadStation(station)
- playRadio() / pauseRadio()
- setGenreFilter(genre)
- setMoodFilter(mood)
- setVolume(volume)
```

### 3. Tạo Radio Components

#### `src/components/radio/RadioPlayer.jsx`
- HTML5 Audio element cho radio streams
- Basic controls (play/pause, volume)
- Station info display
- Stream status indicator

#### `src/components/radio/RadioFilters.jsx`
- Genre filter buttons (Chill, LoFi, Pop, Rock, Jazz, Classical)
- Mood filter buttons (focus, happy, sad, energetic, relaxing)
- Clear filters option

#### `src/components/radio/RadioStationList.jsx`
- List of radio stations based on filters
- One-click play functionality
- Station metadata (name, genre, listeners)

### 4. Tạo Radio Page (`src/pages/Radio.jsx`)
```javascript
// Layout structure
<div>
  <RadioFilters />
  <RadioStationList />
  <RadioPlayer />
</div>
```

### 5. Update Navigation
- Add Radio tab to BottomNav
- Update App.jsx routing
- Add radio icon

## 🎨 UI Requirements

### Design
- Dark theme consistency
- Grid layout for station cards
- Filter chips design
- Now playing indicator

### Interactions
- Smooth filter transitions
- Loading states for stream connections
- Error handling for failed streams
- Touch-friendly controls

## 🔧 Technical Requirements

### Audio Handling
- Use HTML5 Audio for radio streams
- Handle different stream formats (MP3, AAC, OGG)
- Auto-reconnect on stream failures
- Buffer management

### State Management
- Separate from YouTube player state
- Persist selected filters
- Handle concurrent audio (radio vs audiobook)

## 📱 Mobile Optimization
- Touch-friendly filter buttons
- Swipe gestures for station browsing
- Background playback support
- Lock screen controls

## 🧪 Testing Checklist
- [ ] Genre filters work correctly
- [ ] Mood filters work correctly
- [ ] Radio streams play smoothly
- [ ] Volume controls functional
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] Background playback
- [ ] Stream reconnection

## 💡 Implementation Notes
- Start with minimal station list
- Use free/public radio streams
- Handle CORS issues with streams
- Implement progressive enhancement
