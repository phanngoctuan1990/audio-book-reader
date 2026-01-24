import { useState } from "react";
import { PlayerProvider, usePlayer } from "./contexts/PlayerContext";
import { RadioProvider } from "./contexts/RadioContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import { ToastProvider } from "./contexts/ToastContext";
import BottomNav from "./components/common/BottomNav";
import EnhancedMiniPlayer from "./components/player/EnhancedMiniPlayer";
import FullPlayerView from "./components/player/FullPlayerView";
import BackgroundPlaybackInfo from "./components/player/BackgroundPlaybackInfo";
import Home from "./pages/Home";
import Radio from "./pages/Radio";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import InstallBanner from "./components/pwa/InstallBanner";
import AddToPlaylistModal from "./components/playlist/AddToPlaylistModal";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const { isPlayerExpanded } = usePlayer();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "radio":
        return <Radio />;
      case "library":
        return <Library />;
      case "favorites":
        return <Favorites />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-32">
      {/* Main Content */}
      <main className="pt-safe">{renderPage()}</main>

      {/* Enhanced Mini Player (when playing) */}
      <EnhancedMiniPlayer />

      {/* Full Player View (when expanded) */}
      {isPlayerExpanded && <FullPlayerView />}

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* PWA Install Banner */}
      <InstallBanner />

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal />

      {/* Background Playback Info Modal */}
      <BackgroundPlaybackInfo />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <PlayerProvider>
        <RadioProvider>
          <PlaylistProvider>
            <AppContent />
          </PlaylistProvider>
        </RadioProvider>
      </PlayerProvider>
    </ToastProvider>
  );
}

export default App;
