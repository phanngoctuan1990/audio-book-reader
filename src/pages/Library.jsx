import { useState, useEffect } from "react";
import { usePlaylist } from "../contexts/PlaylistContext";
import { getHistory } from "../services/db";
import { usePlayer } from "../contexts/PlayerContext";
import { formatDuration, formatRelativeTime } from "../utils/formatters";
import PlaylistManager from "../components/playlist/PlaylistManager";
import PlaylistEditor from "../components/playlist/PlaylistEditor";

function Library() {
  const [activeTab, setActiveTab] = useState("history");
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const { selectPlaylist, currentPlaylist } = usePlaylist();
  const { loadTrack, currentTrack } = usePlayer();

  // Load history on tab change
  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  // Sync selected playlist with context
  useEffect(() => {
    if (selectedPlaylist) {
      selectPlaylist(selectedPlaylist.id);
    }
  }, [selectedPlaylist, selectPlaylist]);

  // Update selected playlist from context
  useEffect(() => {
    if (currentPlaylist && selectedPlaylist?.id === currentPlaylist.id) {
      setSelectedPlaylist(currentPlaylist);
    }
  }, [currentPlaylist]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await getHistory(20);
      setHistory(data);
    } catch (error) {
      // Silently fail
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handlePlayHistoryItem = (item) => {
    loadTrack(
      {
        videoId: item.videoId,
        title: item.title,
        author: item.author,
        thumbnail: item.thumbnail,
        duration: item.duration,
      },
      item.lastPosition,
    );
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleBackFromPlaylist = () => {
    setSelectedPlaylist(null);
    selectPlaylist(null);
  };

  const tabs = [
    { id: "history", label: "Lịch sử" },
    { id: "playlist", label: "Playlist" },
  ];

  return (
    <div className="px-4 py-6 pb-32">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">📚 Thư viện</h1>
        <p className="text-white/60 text-sm mt-1">Lịch sử nghe và Playlist</p>
      </header>

      {/* Tabs - hide when viewing playlist editor */}
      {!selectedPlaylist && (
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target
                ${
                  activeTab === tab.id
                    ? "bg-gradient-primary text-white"
                    : "bg-dark-700 text-white/60 hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {selectedPlaylist ? (
        <PlaylistEditor
          playlist={selectedPlaylist}
          onBack={handleBackFromPlaylist}
        />
      ) : activeTab === "history" ? (
        <HistoryTab
          history={history}
          isLoading={isLoadingHistory}
          currentTrack={currentTrack}
          onPlay={handlePlayHistoryItem}
        />
      ) : (
        <PlaylistManager onSelectPlaylist={handleSelectPlaylist} />
      )}
    </div>
  );
}

/**
 * History tab content
 */
function HistoryTab({ history, isLoading, currentTrack, onPlay }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-xl bg-dark-800 animate-pulse"
          >
            <div className="w-16 h-16 rounded-lg bg-dark-700" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-dark-700 rounded w-3/4" />
              <div className="h-3 bg-dark-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-dark-800 rounded-2xl p-8 text-center">
        <span className="text-5xl mb-4 block">📖</span>
        <h3 className="text-white font-semibold mb-2">Chưa có lịch sử</h3>
        <p className="text-white/60 text-sm">
          Bắt đầu nghe sách để xem lịch sử của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item) => {
        const isPlaying = currentTrack?.videoId === item.videoId;

        return (
          <button
            key={item.videoId}
            onClick={() => onPlay(item)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl text-left
              transition-all active:scale-[0.98]
              ${
                isPlaying
                  ? "bg-primary/20 border border-primary/50"
                  : "bg-dark-800 hover:bg-dark-700"
              }
            `}
          >
            {/* Thumbnail with progress */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full rounded-lg object-cover"
              />
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 rounded-b-lg overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${item.progress || 0}%` }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-medium truncate ${isPlaying ? "text-primary" : "text-white"}`}
              >
                {item.title}
              </h4>
              <p className="text-white/60 text-xs truncate">{item.author}</p>
              <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                <span>{item.progress || 0}% hoàn thành</span>
                <span>•</span>
                <span>{formatRelativeTime(item.listenedAt)}</span>
              </div>
            </div>

            {/* Play indicator */}
            {isPlaying && (
              <div className="flex gap-0.5 h-4">
                <span className="w-1 bg-primary rounded-full animate-pulse" />
                <span
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Library;
