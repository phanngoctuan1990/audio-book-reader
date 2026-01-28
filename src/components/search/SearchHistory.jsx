/**
 * SearchHistory Component
 * Displays recent search queries with delete functionality
 */
import { Clock, X, Trash2 } from "lucide-react";

function SearchHistory({ history, onSelect, onDelete, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-cream-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold-500" />
          Tìm kiếm gần đây
        </h3>
        <button
          onClick={onClear}
          className="text-xs font-semibold text-cream-600 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-cream-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Xóa tất cả
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Deduplicate history items by query to prevent duplicate key errors */}
        {Array.from(
          new Map(history.map((item) => [item.query, item])).values(),
        ).map((item) => (
          <div
            key={item.query}
            className="group flex items-center bg-cream-100 border border-cream-300/30 rounded-full pl-3 pr-1 py-1 hover:bg-cream-200 hover:border-cream-300/50 transition-all cursor-pointer"
            onClick={() => onSelect(item.query)}
          >
            <span className="text-sm text-cream-800 font-medium max-w-[150px] truncate">
              {item.query}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.query);
              }}
              className="ml-1 p-1 rounded-full text-cream-400 hover:text-red-500 hover:bg-cream-300/50 transition-colors"
              aria-label={`Xóa ${item.query} khỏi lịch sử`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory;
