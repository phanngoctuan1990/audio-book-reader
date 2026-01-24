/**
 * TabNavigation Component
 * Tab switcher between YouTube and Radio modes
 */

const TABS = [
  { id: "youtube", label: "YouTube", icon: "🎵" },
  { id: "radio", label: "Radio", icon: "📻" },
];

function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-2 p-1 bg-dark-800 rounded-2xl">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 
              px-4 py-3 rounded-xl font-medium text-sm
              transition-all duration-200 touch-target
              ${
                isActive
                  ? "bg-gradient-primary text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-dark-700"
              }
            `}
            aria-selected={isActive}
            role="tab"
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TabNavigation;
