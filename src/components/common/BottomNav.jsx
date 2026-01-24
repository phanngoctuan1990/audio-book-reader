/**
 * BottomNav Component
 * Bottom navigation with Soft Gold theme and micro-interactions
 */
import { Home, Radio, Library, Heart } from "lucide-react";
import { hapticLight } from "../../utils/haptics";

function BottomNav({ currentPage, onNavigate }) {
  const navItems = [
    { id: "home", icon: Home, label: "Trang chủ" },
    { id: "radio", icon: Radio, label: "Radio" },
    { id: "library", icon: Library, label: "Thư viện" },
    { id: "favorites", icon: Heart, label: "Yêu thích" },
  ];

  const handleNavigate = (id) => {
    hapticLight();
    onNavigate(id);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-cream-50 shadow-soft-nav border-t border-cream-400/30 pb-safe z-40 lg:hidden"
      role="navigation"
      aria-label="Điều hướng chính"
    >
      {/* Mobile: 80px height, touch-friendly */}
      <div className="flex justify-around items-center h-16 sm:h-20 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`
                relative flex flex-col items-center justify-center gap-0.5 sm:gap-1
                w-full h-full px-2 sm:px-4
                transition-all duration-200 min-h-[44px] min-w-[44px]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700
                focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50
                active:scale-90
                ${
                  isActive
                    ? "text-gold-400"
                    : "text-cream-700 hover:text-cream-800"
                }
              `}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              {/* Icon - 24px on mobile with animation */}
              <IconComponent
                className={`w-6 h-6 transition-all duration-200 ${
                  isActive
                    ? "stroke-[2.5] scale-110 drop-shadow-sm"
                    : "stroke-[1.5]"
                }`}
              />
              {/* Label - small on mobile, larger on tablet */}
              <span
                className={`text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {item.label}
              </span>
              {/* Active indicator dot with animation */}
              {isActive && (
                <span className="absolute bottom-1 sm:bottom-2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gold-400 rounded-full animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
