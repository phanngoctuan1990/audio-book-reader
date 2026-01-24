import { useState } from "react";
import TabNavigation from "../components/navigation/TabNavigation";
import YouTubeTab from "../components/tabs/YouTubeTab";
import RadioTab from "../components/tabs/RadioTab";

function Home() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("homeActiveTab") || "youtube";
  });

  // Persist tab selection
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("homeActiveTab", tabId);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "youtube":
        return <YouTubeTab />;
      case "radio":
        return <RadioTab />;
      default:
        return <YouTubeTab />;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-4 max-w-4xl mx-auto">
      {/* Header - Hidden on desktop (shown in sidebar) */}
      <header className="mb-6 lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-cream-900">
          📚 Bookshelf
        </h1>
        <p className="text-cream-700 text-sm sm:text-base mt-1">
          Nghe sách nói và radio miễn phí
        </p>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block mb-8">
        <h2 className="text-3xl font-bold text-cream-900">Khám phá</h2>
        <p className="text-cream-700 mt-1">
          Tìm kiếm và nghe sách nói yêu thích
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="mb-6">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Tab Content */}
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}

export default Home;
