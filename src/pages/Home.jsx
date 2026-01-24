import { useState } from 'react';
import TabNavigation from '../components/navigation/TabNavigation';
import YouTubeTab from '../components/tabs/YouTubeTab';
import RadioTab from '../components/tabs/RadioTab';

function Home() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('homeActiveTab') || 'youtube';
  });

  // Persist tab selection
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('homeActiveTab', tabId);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'youtube':
        return <YouTubeTab />;
      case 'radio':
        return <RadioTab />;
      default:
        return <YouTubeTab />;
    }
  };

  return (
    <div className="px-4 py-6 pb-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">🎧 Vibe Audio</h1>
        <p className="text-white/60 text-sm mt-1">
          Nghe sách nói và radio miễn phí
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="mb-6">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Home;
