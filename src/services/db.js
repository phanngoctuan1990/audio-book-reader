import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, STORES } from '../utils/constants';

let dbPromise = null;

/**
 * Initialize and get database instance
 * @returns {Promise<IDBDatabase>}
 */
async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Audiobooks store (for offline cache)
        if (!db.objectStoreNames.contains(STORES.AUDIOBOOKS)) {
          db.createObjectStore(STORES.AUDIOBOOKS, { keyPath: 'videoId' });
        }

        // History store
        if (!db.objectStoreNames.contains(STORES.HISTORY)) {
          const historyStore = db.createObjectStore(STORES.HISTORY, { keyPath: 'videoId' });
          historyStore.createIndex('listenedAt', 'listenedAt');
        }

        // Favorites store
        if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
          const favStore = db.createObjectStore(STORES.FAVORITES, { keyPath: 'videoId' });
          favStore.createIndex('addedAt', 'addedAt');
        }

        // Playlists store
        if (!db.objectStoreNames.contains(STORES.PLAYLISTS)) {
          const playlistStore = db.createObjectStore(STORES.PLAYLISTS, { keyPath: 'id' });
          playlistStore.createIndex('createdAt', 'createdAt');
        }

        // Bookmarks store
        if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
          const bookmarkStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'id' });
          bookmarkStore.createIndex('videoId', 'videoId');
          bookmarkStore.createIndex('createdAt', 'createdAt');
        }

        // Settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }

        // Search History store
        if (!db.objectStoreNames.contains(STORES.SEARCH_HISTORY)) {
          const searchStore = db.createObjectStore(STORES.SEARCH_HISTORY, { keyPath: 'query' });
          searchStore.createIndex('searchedAt', 'searchedAt');
        }
      },
    });
  }
  return dbPromise;
}

// ==================== AUDIOBOOKS (Offline Cache) ====================

/**
 * Save audiobook for offline playback
 * @param {Object} data - Audiobook data with audioBlob
 */
export async function saveAudiobook(data) {
  const db = await getDB();
  await db.put(STORES.AUDIOBOOKS, {
    ...data,
    savedAt: Date.now(),
  });
}

/**
 * Get audiobook from offline cache
 * @param {string} videoId 
 * @returns {Promise<Object|undefined>}
 */
export async function getAudiobook(videoId) {
  const db = await getDB();
  return db.get(STORES.AUDIOBOOKS, videoId);
}

/**
 * Get all offline audiobooks
 * @returns {Promise<Array>}
 */
export async function getAllAudiobooks() {
  const db = await getDB();
  return db.getAll(STORES.AUDIOBOOKS);
}

/**
 * Delete audiobook from offline cache
 * @param {string} videoId 
 */
export async function deleteAudiobook(videoId) {
  const db = await getDB();
  await db.delete(STORES.AUDIOBOOKS, videoId);
}

/**
 * Update play position for an audiobook
 * @param {string} videoId 
 * @param {number} position - Current position in seconds
 */
export async function updatePlayPosition(videoId, position) {
  const db = await getDB();
  const existing = await db.get(STORES.AUDIOBOOKS, videoId);
  if (existing) {
    await db.put(STORES.AUDIOBOOKS, {
      ...existing,
      lastPosition: position,
      lastPlayedAt: Date.now(),
    });
  }
}

// ==================== HISTORY ====================

/**
 * Add or update history entry
 * @param {Object} track - Track data
 * @param {number} position - Current position
 * @param {number} duration - Total duration
 */
export async function addToHistory(track, position, duration) {
  const db = await getDB();
  
  // Safe progress calculation
  const safeDuration = duration || track.duration || 0;
  const progress = safeDuration > 0 ? Math.round((position / safeDuration) * 100) : 0;
  
  await db.put(STORES.HISTORY, {
    videoId: track.videoId,
    title: track.title,
    author: track.author,
    thumbnail: track.thumbnail,
    duration: safeDuration,
    lastPosition: position,
    progress: Math.min(progress, 100),
    listenedAt: Date.now(),
  });
}

/**
 * Get listening history sorted by most recent
 * @param {number} limit - Max items to return
 * @returns {Promise<Array>}
 */
export async function getHistory(limit = 20) {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORES.HISTORY, 'listenedAt');
  return all.reverse().slice(0, limit);
}

/**
 * Get tracks that are in progress (progress > 0 and < 100)
 * @returns {Promise<Array>}
 */
export async function getInProgress() {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORES.HISTORY, 'listenedAt');
  
  return all
    .filter(item => {
      // Calculate progress if it's missing or NaN
      let progress = item.progress;
      if (progress === undefined || isNaN(progress)) {
        if (item.duration > 0 && item.lastPosition > 0) {
          progress = Math.round((item.lastPosition / item.duration) * 100);
        } else {
          progress = 0;
        }
      }
      
      // We consider it "in progress" if they've listened at least 1% and haven't reached 99%
      // Or if they've listened for more than 10 seconds
      return (progress > 0 && progress < 99) || (item.lastPosition > 10 && progress < 99);
    })
    .reverse();
}

/**
 * Clear all history
 */
export async function clearHistory() {
  const db = await getDB();
  await db.clear(STORES.HISTORY);
}

// ==================== FAVORITES ====================

/**
 * Add to favorites
 * @param {Object} track - Track data
 */
export async function addFavorite(track) {
  const db = await getDB();
  await db.put(STORES.FAVORITES, {
    videoId: track.videoId,
    title: track.title,
    author: track.author,
    thumbnail: track.thumbnail,
    duration: track.duration,
    addedAt: Date.now(),
  });
}

/**
 * Remove from favorites
 * @param {string} videoId 
 */
export async function removeFavorite(videoId) {
  const db = await getDB();
  await db.delete(STORES.FAVORITES, videoId);
}

/**
 * Get all favorites
 * @returns {Promise<Array>}
 */
export async function getFavorites() {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORES.FAVORITES, 'addedAt');
  return all.reverse();
}

/**
 * Check if item is favorited
 * @param {string} videoId 
 * @returns {Promise<boolean>}
 */
export async function isFavorite(videoId) {
  const db = await getDB();
  const item = await db.get(STORES.FAVORITES, videoId);
  return !!item;
}

// ==================== PLAYLISTS ====================

/**
 * Create a new playlist
 * @param {string} name - Playlist name
 * @returns {Promise<Object>} Created playlist
 */
export async function createPlaylist(name) {
  const db = await getDB();
  const playlist = {
    id: crypto.randomUUID(),
    name,
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.put(STORES.PLAYLISTS, playlist);
  return playlist;
}

/**
 * Get all playlists
 * @returns {Promise<Array>}
 */
export async function getPlaylists() {
  const db = await getDB();
  return db.getAll(STORES.PLAYLISTS);
}

/**
 * Add item to playlist
 * @param {string} playlistId 
 * @param {Object} track 
 */
export async function addToPlaylist(playlistId, track) {
  const db = await getDB();
  const playlist = await db.get(STORES.PLAYLISTS, playlistId);
  if (playlist) {
    playlist.items.push({
      videoId: track.videoId,
      title: track.title,
      author: track.author,
      thumbnail: track.thumbnail,
      duration: track.duration,
      order: playlist.items.length,
    });
    playlist.updatedAt = Date.now();
    await db.put(STORES.PLAYLISTS, playlist);
  }
}

/**
 * Delete playlist
 * @param {string} playlistId 
 */
export async function deletePlaylist(playlistId) {
  const db = await getDB();
  await db.delete(STORES.PLAYLISTS, playlistId);
}

// ==================== BOOKMARKS ====================

/**
 * Add bookmark
 * @param {string} videoId 
 * @param {number} position - Position in seconds
 * @param {string} note - Optional note
 */
export async function addBookmark(videoId, position, note = '') {
  const db = await getDB();
  await db.put(STORES.BOOKMARKS, {
    id: crypto.randomUUID(),
    videoId,
    position,
    note,
    createdAt: Date.now(),
  });
}

/**
 * Get bookmarks for a video
 * @param {string} videoId 
 * @returns {Promise<Array>}
 */
export async function getBookmarks(videoId) {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORES.BOOKMARKS, 'videoId');
  return all.filter(b => b.videoId === videoId).sort((a, b) => a.position - b.position);
}

/**
 * Delete bookmark
 * @param {string} bookmarkId 
 */
export async function deleteBookmark(bookmarkId) {
  const db = await getDB();
  await db.delete(STORES.BOOKMARKS, bookmarkId);
}

// ==================== SETTINGS ====================

/**
 * Save setting
 * @param {string} key 
 * @param {any} value 
 */
export async function saveSetting(key, value) {
  const db = await getDB();
  await db.put(STORES.SETTINGS, { key, value });
}

/**
 * Get setting
 * @param {string} key 
 * @param {any} defaultValue 
 * @returns {Promise<any>}
 */
export async function getSetting(key, defaultValue = null) {
  const db = await getDB();
  const item = await db.get(STORES.SETTINGS, key);
  return item?.value ?? defaultValue;
}
// ==================== SEARCH HISTORY ====================

/**
 * Add query to search history
 * @param {string} query
 */
export async function addToSearchHistory(query) {
  if (!query || !query.trim()) return;
  const db = await getDB();
  await db.put(STORES.SEARCH_HISTORY, {
    query: query.trim(),
    searchedAt: Date.now(),
  });
}

/**
 * Get search history sorted by most recent
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getSearchHistory(limit = 10) {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORES.SEARCH_HISTORY, 'searchedAt');
  return all.reverse().slice(0, limit);
}

/**
 * Delete a specific query from history
 * @param {string} query
 */
export async function deleteSearchHistory(query) {
  const db = await getDB();
  await db.delete(STORES.SEARCH_HISTORY, query);
}

/**
 * Clear all search history
 */
export async function clearSearchHistory() {
  const db = await getDB();
  await db.clear(STORES.SEARCH_HISTORY);
}
