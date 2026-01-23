/**
 * PlayerContext - Re-exports from YouTubePlayerContext
 * Maintains backward compatibility with existing components
 */
import {
  YouTubePlayerProvider,
  useYouTubePlayer,
} from "./YouTubePlayerContext";

// Re-export with original names for backward compatibility
export const PlayerProvider = YouTubePlayerProvider;
export const usePlayer = useYouTubePlayer;
