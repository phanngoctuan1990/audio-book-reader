/**
 * SearchFilters Component
 * Advanced search filters for duration, upload date, and sort options
 */
import { useState } from "react";

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
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${
            hasActiveFilters
              ? "bg-primary/20 text-primary"
              : "bg-dark-800 text-white/60 hover:text-white"
          }
        `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Bộ lọc
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-primary" />
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filter panel */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-dark-800 rounded-xl space-y-4 animate-fadeIn">
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
              className="w-full py-2 text-sm text-white/60 hover:text-white transition-colors"
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
 * Individual filter group with label and options
 */
function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-3 py-1.5 rounded-full text-sm transition-all
              ${
                value === option.value
                  ? "bg-primary text-white"
                  : "bg-dark-700 text-white/60 hover:text-white hover:bg-dark-600"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchFilters;
