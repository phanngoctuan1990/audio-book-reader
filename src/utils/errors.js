/**
 * Parse YouTube API error and return user-friendly message
 * @param {Error} err - Error object
 * @returns {string} User-friendly error message
 */
export function parseYouTubeError(err) {
  const message = err.message?.toLowerCase() || "";

  // Quota exceeded
  if (message.includes("quota") || message.includes("exceeded")) {
    return "Đã vượt quá giới hạn tìm kiếm (Quota). Vui lòng thử lại sau.";
  }

  // Rate limit
  if (message.includes("rate") || message.includes("limit")) {
    return "Quá nhiều yêu cầu. Vui lòng đợi một chút.";
  }

  // API key issues
  if (
    message.includes("api key") ||
    message.includes("forbidden") ||
    message.includes("unauthorized")
  ) {
    return "Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.";
  }

  // Network errors
  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("failed to fetch")
  ) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra internet.";
  }

  // Generic error
  return "Không thể kết nối tới YouTube. Vui lòng thử lại.";
}
