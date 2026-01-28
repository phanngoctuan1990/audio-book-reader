/**
 * RadioFilters Component
 * Genre and mood filter buttons for radio stations
 * Refactored for Soft Gold theme and high readability
 */
import { useRadio } from "../../contexts/RadioContext";

// Genre labels in Vietnamese
const GENRE_LABELS = {
  chill: "Chill",
  lofi: "Lo-Fi",
  jazz: "Jazz",
  classical: "Cổ điển",
  ambient: "Ambient",
  electronic: "Electronic",
};

// Mood labels in Vietnamese
const MOOD_LABELS = {
  focus: "🎯 Tập trung",
  happy: "😊 Vui vẻ",
  relaxing: "😌 Thư giãn",
  energetic: "⚡ Năng động",
  sleep: "😴 Ngủ",
};

function RadioFilters() {
  const {
    genres,
    moods,
    selectedGenre,
    selectedMood,
    setGenreFilter,
    setMoodFilter,
    clearFilters,
  } = useRadio();

  const hasActiveFilters = selectedGenre || selectedMood;

  return (
    <div className="space-y-4">
      {/* Genre filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-cream-800">Thể loại</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-gold-700 hover:text-gold-800 transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setGenreFilter(genre)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200 active:scale-95 border
                ${
                  selectedGenre === genre
                    ? "bg-gold-500 text-white border-gold-600 shadow-soft-3d-sm"
                    : "bg-cream-50 text-cream-700 border-cream-400/50 hover:bg-cream-100/80 hover:text-cream-900"
                }
              `}
            >
              {GENRE_LABELS[genre] || genre}
            </button>
          ))}
        </div>
      </div>

      {/* Mood filters */}
      <div>
        <h3 className="text-sm font-semibold text-cream-800 mb-2">Tâm trạng</h3>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setMoodFilter(mood)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200 active:scale-95 border
                ${
                  selectedMood === mood
                    ? "bg-gold-500 text-white border-gold-600 shadow-soft-3d-sm"
                    : "bg-cream-50 text-cream-700 border-cream-400/50 hover:bg-cream-100/80 hover:text-cream-900"
                }
              `}
            >
              {MOOD_LABELS[mood] || mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RadioFilters;
