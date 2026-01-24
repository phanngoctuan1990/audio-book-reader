/**
 * SearchFilters Component
 * Advanced search filters for duration, upload date, and sort options - Soft Gold theme
 */
import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const FILTER_OPTIONS = {
  duration: [
    { value: "all", label: "Tất cả" },
    { value: "short", label: "Dưới 1h" },
    { value: "medium", label: "1-3h" },
    { value: "long", label: "Trên 3h" },
  ],
  uploadDate: [
    { value: "all", label: "Tất cả" },
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "year", label: "Năm này" },
  ],
  sortBy: [
    { value: "relevance", label: "Liên quan" },
    { value: "date", label: "Ngày tải lên" },
    { value: "viewCount", label: "Lượt xem" },
    { value: "rating", label: "Đánh giá" },
  ],
};

function SearchFilters({ filters, onFilterChange, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any filter is active
  const hasActiveFilters =
    filters.duration !== "all" ||
    filters.uploadDate !== "all" ||
    filters.sortBy !== "relevance";

  return (
    <div className="search-filters">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all
          min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700
          ${
            hasActiveFilters
              ? "bg-gold-100 text-gold-700 border border-gold-400"
              : "bg-cream-300/50 text-cream-700 hover:text-cream-800 hover:bg-cream-300"
          }
        `}
        aria-expanded={isExpanded}
        aria-controls="filter-panel"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Bộ lọc
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-gold-400" />
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filter panel */}
      {isExpanded && (
        <div
          id="filter-panel"
          className="mt-3 p-4 bg-cream-50 rounded-2xl space-y-4 animate-fade-in shadow-soft-card border border-cream-400/30"
        >
          {/* Duration filter */}
          <FilterGroup
            label="Thời lượng"
            options={FILTER_OPTIONS.duration}
            value={filters.duration}
            onChange={(value) => onFilterChange("duration", value)}
          />

          {/* Upload date filter */}
          <FilterGroup
            label="Ngày tải lên"
            options={FILTER_OPTIONS.uploadDate}
            value={filters.uploadDate}
            onChange={(value) => onFilterChange("uploadDate", value)}
          />

          {/* Sort filter */}
          <FilterGroup
            label="Sắp xếp theo"
            options={FILTER_OPTIONS.sortBy}
            value={filters.sortBy}
            onChange={(value) => onFilterChange("sortBy", value)}
          />

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full py-2.5 text-sm text-cream-700 hover:text-gold-600 
                         transition-colors rounded-lg hover:bg-cream-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual filter group with label and options - Soft Gold theme
 */
function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-cream-600 font-medium mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-3 py-1.5 rounded-full text-sm transition-all min-h-[36px]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700
              ${
                value === option.value
                  ? "bg-gold-400 text-white shadow-soft-3d-sm"
                  : "bg-cream-200 text-cream-700 hover:text-cream-800 hover:bg-cream-300"
              }
            `}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchFilters;
