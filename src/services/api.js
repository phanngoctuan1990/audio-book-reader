import { searchVideos, getVideoDetails as ytGetVideoDetails } from "./youtube";

/**
 * Search for audiobooks using YouTube Data API v3
 * @param {string} query - Search query
 * @param {boolean} addPrefix - Add "Sách nói" prefix
 * @returns {Promise<Array>} Search results
 */
export async function search(query, addPrefix = true) {
  const searchQuery = addPrefix ? `Sách nói ${query}` : query;

  try {
    const results = await searchVideos(searchQuery);
    return results;
  } catch (error) {
    throw new Error("Không thể tìm kiếm");
  }
}

/**
 * Get stream info for YouTube video
 * Note: With YouTube IFrame Player, we don't need direct stream URL
 * This returns metadata for the player
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Stream info
 */
export async function getStream(videoId) {
  try {
    const details = await ytGetVideoDetails(videoId);

    if (!details) {
      throw new Error("Không tìm thấy video");
    }

    return {
      videoId,
      url: `https://www.youtube.com/embed/${videoId}`,
      mimeType: "video/mp4",
      title: details.title,
      author: details.author,
      thumbnail: details.thumbnail,
      duration: details.duration,
    };
  } catch (error) {
    throw new Error("Không thể phát audio");
  }
}

/**
 * Get video details
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Video details
 */
export async function getDetails(videoId) {
  try {
    const details = await ytGetVideoDetails(videoId);
    if (!details) throw new Error("Video not found");
    return {
      videoId: details.id,
      title: details.title,
      author: details.author,
      thumbnail: details.thumbnail,
      duration: details.duration,
      views: details.viewCount,
    };
  } catch (error) {
    throw new Error("Không thể lấy thông tin video");
  }
}

/**
 * Reset API state
 */
export function resetApi() {
  // API reset
}
