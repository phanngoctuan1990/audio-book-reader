import { useState, useEffect } from "react";
import { usePlaylist } from "../contexts/PlaylistContext";
import { getHistory, getInProgress } from "../services/db";
import { usePlayer } from "../contexts/PlayerContext";
import { formatDuration, formatRelativeTime } from "../utils/formatters";
import PlaylistManager from "../components/playlist/PlaylistManager";
import PlaylistEditor from "../components/playlist/PlaylistEditor";

/**
 * Library Page - Soft Gold Theme
 * Manages History, In-Progress books, and Playlists
 */
function Library() {
  const [activeTab, setActiveTab] = useState("inprogress");
  const [history, setHistory] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const { selectPlaylist, currentPlaylist } = usePlaylist();
  const { loadTrack, currentTrack } = usePlayer();

  // Load data on tab change
  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    } else if (activeTab === "inprogress") {
      loadInProgress();
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
    setIsLoading(true);
    try {
      const data = await getHistory(20);
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInProgress = async () => {
    setIsLoading(true);
    try {
      const data = await getInProgress();
      setInProgress(data);
    } catch (error) {
      console.error("Failed to load in-progress:", error);
    } finally {
      setIsLoading(false);
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
    { id: "inprogress", label: "Đang nghe" },
    { id: "history", label: "Lịch sử" },
    { id: "playlist", label: "Playlist" },
  ];

  return (
    <div className="px-4 py-6 pb-32 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-cream-900">📚 Thư viện</h1>
        <p className="text-cream-700 text-sm mt-1">Quản lý sách đang nghe, lịch sử và playlist</p>
      </header>

      {/* Tabs - hide when viewing playlist editor */}
      {!selectedPlaylist && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap touch-target
                ${
                  activeTab === tab.id
                    ? "bg-gold-400 text-white shadow-soft-3d-sm scale-105"
                    : "bg-cream-100 text-cream-700 hover:bg-cream-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="tab-content animate-in fade-in slide-in-from-bottom-2 duration-300">
        {selectedPlaylist ? (
          <PlaylistEditor
            playlist={selectedPlaylist}
            onBack={handleBackFromPlaylist}
          />
        ) : activeTab === "inprogress" ? (
          <InProgressTab
            tracks={inProgress}
            isLoading={isLoading}
            currentTrack={currentTrack}
            onPlay={handlePlayHistoryItem}
          />
        ) : activeTab === "history" ? (
          <HistoryTab
            history={history}
            isLoading={isLoading}
            currentTrack={currentTrack}
            onPlay={handlePlayHistoryItem}
          />
        ) : (
          <PlaylistManager onSelectPlaylist={handleSelectPlaylist} />
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton Loader for lists
 */
function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-3 p-3 rounded-xl bg-cream-100 animate-pulse"
        >
          <div className="w-16 h-16 rounded-lg bg-cream-200" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-cream-200 rounded w-3/4" />
            <div className="h-3 bg-cream-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * In Progress tab content
 */
function InProgressTab({ tracks, isLoading, currentTrack, onPlay }) {
  if (isLoading) return <ListSkeleton />;

  if (tracks.length === 0) {
    return (
      <div className="bg-cream-50 rounded-2xl p-8 text-center border border-cream-300/50 shadow-soft-card">
        <span className="text-5xl mb-4 block">🏜️</span>
        <h3 className="text-cream-900 font-bold mb-2 text-lg">Chưa có sách dang dở</h3>
        <p className="text-cream-600 text-sm max-w-xs mx-auto">
          Các cuốn sách bạn đang nghe sẽ xuất hiện ở đây để bạn dễ dàng tiếp tục.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      {tracks.map((track) => {
        const isPlaying = currentTrack?.videoId === track.videoId;

        return (
          <button
            key={track.videoId}
            onClick={() => onPlay(track)}
            className={`
              w-full flex items-center gap-4 p-4 rounded-2xl text-left
              transition-all duration-200 active:scale-[0.98]
              ${
                isPlaying
                  ? "bg-gold-50 border-2 border-gold-400 shadow-soft-3d-sm"
                  : "bg-cream-50 border border-cream-300/30 hover:bg-cream-100 hover:border-cream-300/50 shadow-soft-card"
              }
            `}
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full rounded-xl object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20 rounded-b-xl overflow-hidden">
                <div
                  className="h-full bg-gold-500"
                  style={{ width: `${track.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`text-base font-bold truncate ${isPlaying ? "text-gold-700" : "text-cream-900"}`}>
                {track.title}
              </h4>
              <p className="text-cream-600 text-xs truncate mb-2">{track.author}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gold-100 text-gold-700 rounded decoration-none">
                  {track.progress}%
                </span>
                <span className="text-[10px] text-cream-500 italic">
                  {formatRelativeTime(track.listenedAt)}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * History tab content
 */
function HistoryTab({ history, isLoading, currentTrack, onPlay }) {
  if (isLoading) return <ListSkeleton />;

  if (history.length === 0) {
    return (
      <div className="bg-cream-50 rounded-2xl p-8 text-center border border-cream-300/50 shadow-soft-card">
        <span className="text-5xl mb-4 block">📖</span>
        <h3 className="text-cream-900 font-bold mb-2">Chưa có lịch sử</h3>
        <p className="text-cream-600 text-sm">
          Bắt đầu nghe sách để xem lịch sử của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => {
        const isPlaying = currentTrack?.videoId === item.videoId;

        return (
          <button
            key={item.videoId}
            onClick={() => onPlay(item)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl text-left
              transition-all duration-200 active:scale-[0.98]
              ${
                isPlaying
                  ? "bg-gold-50 border border-gold-400"
                  : "bg-cream-50 border border-cream-300/20 hover:bg-cream-100 shadow-soft-card"
              }
            `}
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full rounded-lg object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
                <div
                  className="h-full bg-gold-400"
                  style={{ width: `${item.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-bold truncate ${isPlaying ? "text-gold-700" : "text-cream-900"}`}>
                {item.title}
              </h4>
              <p className="text-cream-600 text-xs truncate">{item.author}</p>
              <div className="flex items-center gap-2 text-[10px] text-cream-500 mt-1">
                <span>{item.progress || 0}% hoàn thành</span>
                <span>•</span>
                <span>{formatRelativeTime(item.listenedAt)}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default Library;
