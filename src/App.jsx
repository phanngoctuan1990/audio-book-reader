import { useState } from "react";
import { PlayerProvider, usePlayer } from "./contexts/PlayerContext";
import { ToastProvider } from "./contexts/ToastContext";
import BottomNav from "./components/common/BottomNav";
import MiniPlayer from "./components/player/MiniPlayer";
import FullPlayerView from "./components/player/FullPlayerView";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import Downloads from "./pages/Downloads";
import InstallBanner from "./components/pwa/InstallBanner";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const { isPlayerExpanded } = usePlayer();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "library":
        return <Library />;
      case "favorites":
        return <Favorites />;
      case "downloads":
        return <Downloads />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-32">
      {/* Main Content */}
      <main className="pt-safe">{renderPage()}</main>

      {/* Mini Player (when playing) */}
      <MiniPlayer />

      {/* Full Player View (when expanded) */}
      {isPlayerExpanded && <FullPlayerView />}

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* PWA Install Banner */}
      <InstallBanner />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </ToastProvider>
  );
}

export default App;
