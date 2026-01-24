/**
 * RadioFilters Component
 * Genre and mood filter buttons for radio stations
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
          <h3 className="text-sm font-medium text-white/80">Thể loại</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:text-primary-light transition-colors"
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
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 active:scale-95
                ${
                  selectedGenre === genre
                    ? "bg-gradient-to-r from-accent-purple to-primary text-white"
                    : "bg-dark-700 text-white/70 hover:text-white hover:bg-dark-600 border border-white/10"
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
        <h3 className="text-sm font-medium text-white/80 mb-2">Tâm trạng</h3>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setMoodFilter(mood)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 active:scale-95
                ${
                  selectedMood === mood
                    ? "bg-gradient-to-r from-primary to-accent-blue text-white"
                    : "bg-dark-700 text-white/70 hover:text-white hover:bg-dark-600 border border-white/10"
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
