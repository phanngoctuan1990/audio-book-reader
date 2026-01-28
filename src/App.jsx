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
    <div className="min-h-screen bg-cream-200 text-cream-800">
      {/* Skip to main content target */}
      <a id="main-content" className="sr-only" aria-hidden="true" />

      {/* Desktop Layout Container */}
      <div className="lg:flex lg:max-w-7xl lg:mx-auto">
        {/* Desktop Side Navigation */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-full lg:bg-cream-50 lg:border-r lg:border-cream-400/30 lg:p-6 lg:shadow-soft-card">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-cream-900 flex items-center gap-2">
              📚 Bookshelf
            </h1>
          </div>
          <DesktopNav currentPage={currentPage} onNavigate={setCurrentPage} />
        </aside>

        {/* Main Content */}
        <main className="pt-safe pb-32 lg:pb-8 lg:ml-64 lg:flex-1">
          {renderPage()}
        </main>
      </div>

      {/* Enhanced Mini Player (when playing) */}
      <EnhancedMiniPlayer />

      {/* Full Player View (when expanded) */}
      {isPlayerExpanded && <FullPlayerView />}

      {/* Bottom Navigation - Mobile/Tablet only */}
      <div className="lg:hidden">
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* PWA Install Banner */}
      <InstallBanner />

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal />

      {/* Background Playback Info Modal */}
      <BackgroundPlaybackInfo />

      {/* Footer / Copyright */}
      <footer className="mt-8 py-8 text-center text-cream-600 text-xs sm:text-sm border-t border-cream-400/20 w-full max-w-4xl mx-auto">
        <p>
          &copy; {new Date().getFullYear()} Vibe Audio. Thiết kế và phát triển
          bởi{" "}
          <span className="text-gold-700 font-medium whitespace-nowrap">
            Phan Ngọc Tuấn
          </span>
        </p>
      </footer>
    </div>
  );
}

/**
 * Desktop Side Navigation Component
 */
import {
  Home as HomeIcon,
  Radio as RadioIcon,
  Library as LibraryIcon,
  Heart,
} from "lucide-react";

function DesktopNav({ currentPage, onNavigate }) {
  const navItems = [
    { id: "home", icon: HomeIcon, label: "Trang chủ" },
    { id: "radio", icon: RadioIcon, label: "Radio" },
    { id: "library", icon: LibraryIcon, label: "Thư viện" },
    { id: "favorites", icon: Heart, label: "Yêu thích" },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700
              ${
                isActive
                  ? "bg-gold-400 text-white shadow-soft-3d-sm"
                  : "text-cream-700 hover:bg-cream-200 hover:text-cream-900"
              }
            `}
            aria-current={isActive ? "page" : undefined}
          >
            <IconComponent className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
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
