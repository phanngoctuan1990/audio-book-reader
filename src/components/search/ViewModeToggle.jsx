/**
 * ViewModeToggle Component
 * Toggle between grid and list view for search results
 */

function ViewModeToggle({ mode, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-dark-800 rounded-lg">
      {/* Grid button */}
      <button
        onClick={() => onChange("grid")}
        className={`
          flex items-center justify-center w-9 h-9 rounded-md transition-all
          ${
            mode === "grid"
              ? "bg-primary text-white"
              : "text-white/60 hover:text-white hover:bg-dark-700"
          }
        `}
        aria-label="Grid view"
        title="Grid view"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
        </svg>
      </button>

      {/* List button */}
      <button
        onClick={() => onChange("list")}
        className={`
          flex items-center justify-center w-9 h-9 rounded-md transition-all
          ${
            mode === "list"
              ? "bg-primary text-white"
              : "text-white/60 hover:text-white hover:bg-dark-700"
          }
        `}
        aria-label="List view"
        title="List view"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
        </svg>
      </button>
    </div>
  );
}

export default ViewModeToggle;
