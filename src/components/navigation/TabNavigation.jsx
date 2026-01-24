/**
 * TabNavigation Component
 * Tab switcher between YouTube and Radio modes with Soft Gold theme and responsive design
 */

const TABS = [
  { id: "youtube", label: "Sách nói", icon: "📖" },
  { id: "radio", label: "Radio", icon: "📻" },
];

function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div
      className="flex items-center gap-2 p-1.5 bg-cream-300/50 rounded-full sm:max-w-md"
      role="tablist"
      aria-label="Chọn loại nội dung"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 
              px-4 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base
              transition-all duration-200 min-h-[44px]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700
              focus-visible:ring-offset-2 focus-visible:ring-offset-cream-200
              ${
                isActive
                  ? "bg-gold-400 text-white shadow-soft-3d-sm"
                  : "text-cream-700 hover:text-cream-800 hover:bg-cream-300/50"
              }
            `}
            aria-selected={isActive}
            role="tab"
            tabIndex={isActive ? 0 : -1}
          >
            <span className="text-base sm:text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TabNavigation;
