function BottomNav({ currentPage, onNavigate }) {
  const navItems = [
    { id: "home", icon: "🏠", label: "Trang chủ" },
    { id: "radio", icon: "📻", label: "Radio" },
    { id: "library", icon: "📚", label: "Thư viện" },
    { id: "favorites", icon: "❤️", label: "Yêu thích" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 pb-safe z-40">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                transition-all duration-200 touch-target
                ${
                  isActive
                    ? "text-primary scale-105"
                    : "text-white/60 hover:text-white/80"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className={`text-xs font-medium ${isActive ? "text-primary" : ""}`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
