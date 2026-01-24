/**
 * RadioTab Component
 * Radio streaming content for tab navigation - Soft Gold theme
 */
import RadioFilters from "../radio/RadioFilters";
import RadioStationList from "../radio/RadioStationList";
import RadioPlayer from "../radio/RadioPlayer";

function RadioTab() {
  return (
    <div className="radio-tab">
      {/* Filters */}
      <section className="mb-6">
        <RadioFilters />
      </section>

      {/* Featured Stations */}
      <section className="mb-6">
        <div
          className="bg-gradient-to-br from-gold-100 to-cream-200 
                        rounded-2xl p-4 border border-gold-300/50 shadow-soft-card"
        >
          <h3 className="text-cream-900 font-semibold mb-2 flex items-center gap-2">
            ✨ Radio trực tuyến
          </h3>
          <p className="text-cream-700 text-sm">
            Chọn thể loại và tâm trạng để tìm kênh phù hợp. Nhấn vào kênh để
            phát ngay.
          </p>
        </div>
      </section>

      {/* Station List */}
      <section>
        <h2 className="text-lg font-semibold text-cream-900 mb-3">
          Danh sách kênh
        </h2>
        <RadioStationList />
      </section>

      {/* Mini Radio Player (fixed at bottom) */}
      <RadioPlayer />
    </div>
  );
}

export default RadioTab;
