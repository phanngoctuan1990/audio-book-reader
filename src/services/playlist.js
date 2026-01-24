/**
 * Playlist Service - Advanced playlist management
 * Extends basic db.js functionality with additional features
 */
import {
  createPlaylist as dbCreatePlaylist,
  getPlaylists as dbGetPlaylists,
  addToPlaylist as dbAddToPlaylist,
  deletePlaylist as dbDeletePlaylist,
} from "./db";
import { openDB } from "idb";
import { DB_NAME, DB_VERSION, STORES } from "../utils/constants";

/**
 * Get database instance
 */
async function getDB() {
  return openDB(DB_NAME, DB_VERSION);
}

/**
 * Create a new playlist
 * @param {string} name - Playlist name
 * @returns {Promise<Object>} Created playlist
 */
export async function createPlaylist(name) {
  return dbCreatePlaylist(name);
}

/**
 * Get all playlists with computed metadata
 * @returns {Promise<Array>} Playlists with metadata
 */
export async function getPlaylists() {
  const playlists = await dbGetPlaylists();
  return playlists
    .map((playlist) => ({
      ...playlist,
      trackCount: playlist.items?.length || 0,
      thumbnail: playlist.items?.[0]?.thumbnail || null,
      totalDuration: calculateTotalDuration(playlist.items || []),
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Get a single playlist by ID
 * @param {string} playlistId - Playlist ID
 * @returns {Promise<Object|null>} Playlist or null
 */
export async function getPlaylistById(playlistId) {
  const db = await getDB();
  const playlist = await db.get(STORES.PLAYLISTS, playlistId);
  if (!playlist) return null;

  return {
    ...playlist,
    trackCount: playlist.items?.length || 0,
    thumbnail: playlist.items?.[0]?.thumbnail || null,
    totalDuration: calculateTotalDuration(playlist.items || []),
  };
}

/**
 * Add track to playlist
 * @param {string} playlistId - Playlist ID
 * @param {Object} track - Track object
 * @returns {Promise<boolean>} Success status
 */
export async function addToPlaylist(playlistId, track) {
  const db = await getDB();
  const playlist = await db.get(STORES.PLAYLISTS, playlistId);

  if (!playlist) return false;

  // Check if track already exists
  const exists = playlist.items?.some((item) => item.videoId === track.videoId);
  if (exists) return false;

  playlist.items = playlist.items || [];
  playlist.items.push({
    videoId: track.videoId,
    title: track.title,
    author: track.author,
    thumbnail: track.thumbnail,
    duration: track.duration,
    addedAt: Date.now(),
  });
  playlist.updatedAt = Date.now();

  await db.put(STORES.PLAYLISTS, playlist);
  return true;
}

/**
 * Remove track from playlist
 * @param {string} playlistId - Playlist ID
 * @param {string} videoId - Video ID to remove
 * @returns {Promise<boolean>} Success status
 */
export async function removeFromPlaylist(playlistId, videoId) {
  const db = await getDB();
  const playlist = await db.get(STORES.PLAYLISTS, playlistId);

  if (!playlist) return false;

  playlist.items =
    playlist.items?.filter((item) => item.videoId !== videoId) || [];
  playlist.updatedAt = Date.now();

  await db.put(STORES.PLAYLISTS, playlist);
  return true;
}

/**
 * Delete entire playlist
 * @param {string} playlistId - Playlist ID
 */
export async function deletePlaylist(playlistId) {
  return dbDeletePlaylist(playlistId);
}

/**
 * Clear all tracks from playlist
 * @param {string} playlistId - Playlist ID
 */
export async function clearPlaylist(playlistId) {
  const db = await getDB();
  const playlist = await db.get(STORES.PLAYLISTS, playlistId);

  if (!playlist) return;

  playlist.items = [];
  playlist.updatedAt = Date.now();

  await db.put(STORES.PLAYLISTS, playlist);
}

/**
 * Update playlist name
 * @param {string} playlistId - Playlist ID
 * @param {string} name - New name
 */
export async function updatePlaylistName(playlistId, name) {
  const db = await getDB();
  const playlist = await db.get(STORES.PLAYLISTS, playlistId);

  if (!playlist) return;

  playlist.name = name;
  playlist.updatedAt = Date.now();

  await db.put(STORES.PLAYLISTS, playlist);
}

/**
 * Reorder tracks in playlist
 * @param {string} playlistId - Playlist ID
 * @param {number} fromIndex - Source index
 * @param {number} toIndex - Destination index
 */
export async function reorderPlaylist(playlistId, fromIndex, toIndex) {
  const db = await getDB();
  const playlist = await db.get(STORES.PLAYLISTS, playlistId);

  if (!playlist || !playlist.items) return;

  const items = [...playlist.items];
  const [removed] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, removed);

  playlist.items = items;
  playlist.updatedAt = Date.now();

  await db.put(STORES.PLAYLISTS, playlist);
}

/**
 * Search tracks within a playlist
 * @param {string} playlistId - Playlist ID
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching tracks
 */
export async function searchInPlaylist(playlistId, query) {
  const playlist = await getPlaylistById(playlistId);

  if (!playlist || !query.trim()) return playlist?.items || [];

  const lowerQuery = query.toLowerCase();
  return playlist.items.filter(
    (item) =>
      item.title?.toLowerCase().includes(lowerQuery) ||
      item.author?.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Calculate total duration of tracks
 * @param {Array} items - Track items
 * @returns {number} Total duration in seconds
 */
function calculateTotalDuration(items) {
  return items.reduce((total, item) => {
    if (typeof item.duration === "number") {
      return total + item.duration;
    }
    if (typeof item.duration === "string") {
      return total + parseDurationToSeconds(item.duration);
    }
    return total;
  }, 0);
}

/**
 * Parse duration string to seconds
 * @param {string} duration - Duration string (e.g., "1:23:45" or "23:45")
 * @returns {number} Duration in seconds
 */
function parseDurationToSeconds(duration) {
  if (!duration) return 0;

  const parts = duration
    .split(":")
    .map((p) => parseInt(p, 10))
    .filter((n) => !isNaN(n));

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }

  return 0;
}
