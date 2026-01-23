/**
 * YouTubePlayer Component
 * Self-contained YouTube IFrame player with custom controls overlay
 */
import { useState, useEffect, useRef } from "react";
import {
  createPlayer,
  destroyPlayer,
  playVideo,
  pauseVideo,
  seekTo,
  setVolume as ytSetVolume,
  getCurrentTime,
  getDuration,
  PlayerState,
} from "../../services/youtube";
import { formatTime } from "../../utils/formatters";

function YouTubePlayer({
  videoId,
  onReady,
  onStateChange,
  onError,
  autoplay = false,
  controls = true,
}) {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isLoading: true,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isReady: false,
  });

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const timeUpdateRef = useRef(null);

  // Initialize player
  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    const initPlayer = async () => {
      try {
        setPlayerState((prev) => ({ ...prev, isLoading: true }));

        playerRef.current = await createPlayer(
          containerRef.current.id,
          videoId,
          {
            autoplay,
            onReady: handlePlayerReady,
            onStateChange: handleStateChange,
            onError: handlePlayerError,
          },
        );
      } catch (error) {
        if (onError) onError(error);
      }
    };

    initPlayer();

    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }
      destroyPlayer();
      playerRef.current = null;
    };
  }, [videoId]);

  // Time update interval
  useEffect(() => {
    if (playerState.isPlaying && playerState.isReady) {
      timeUpdateRef.current = setInterval(() => {
        const time = getCurrentTime();
        const dur = getDuration();
        setPlayerState((prev) => ({
          ...prev,
          currentTime: time,
          duration: dur > 0 ? dur : prev.duration,
        }));
      }, 250);
    }

    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }
    };
  }, [playerState.isPlaying, playerState.isReady]);

  // Player event handlers
  const handlePlayerReady = (event) => {
    setPlayerState((prev) => ({
      ...prev,
      isReady: true,
      isLoading: false,
      duration: getDuration(),
    }));
    if (onReady) onReady(event);
  };

  const handleStateChange = (event) => {
    const state = event.data;

    switch (state) {
      case PlayerState.PLAYING:
        setPlayerState((prev) => ({
          ...prev,
          isPlaying: true,
          isLoading: false,
        }));
        break;
      case PlayerState.PAUSED:
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        break;
      case PlayerState.BUFFERING:
        setPlayerState((prev) => ({ ...prev, isLoading: true }));
        break;
      case PlayerState.ENDED:
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        break;
      case PlayerState.CUED:
        setPlayerState((prev) => ({ ...prev, isLoading: false }));
        break;
    }

    if (onStateChange) onStateChange(event);
  };

  const handlePlayerError = (event) => {
    setPlayerState((prev) => ({ ...prev, isLoading: false }));
    if (onError) onError(event);
  };

  // Control handlers
  const handlePlay = () => {
    playVideo();
  };

  const handlePause = () => {
    pauseVideo();
  };

  const handleToggle = () => {
    if (playerState.isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleSeek = (time) => {
    seekTo(time);
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * playerState.duration;
    handleSeek(newTime);
  };

  const handleVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    ytSetVolume(volume);
    setPlayerState((prev) => ({ ...prev, volume }));
  };

  const progress =
    playerState.duration > 0
      ? (playerState.currentTime / playerState.duration) * 100
      : 0;

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* YouTube IFrame Container */}
      <div
        ref={containerRef}
        id={`youtube-player-${videoId}`}
        className="w-full aspect-video"
      />

      {/* Custom Controls Overlay */}
      {controls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          {/* Loading overlay */}
          {playerState.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress bar */}
            <div
              className="h-1 bg-white/30 rounded-full cursor-pointer mb-3"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={handleToggle}
                  disabled={!playerState.isReady}
                  className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  {playerState.isPlaying ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-white ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Time display */}
                <span className="text-white text-sm">
                  {formatTime(playerState.currentTime)} /{" "}
                  {formatTime(playerState.duration)}
                </span>
              </div>

              {/* Volume control */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={playerState.volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YouTubePlayer;
