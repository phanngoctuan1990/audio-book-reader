/**
 * Radio Page
 * Internet radio streaming with genre and mood filters
 */
import RadioFilters from "../components/radio/RadioFilters";
import RadioStationList from "../components/radio/RadioStationList";
import RadioPlayer from "../components/radio/RadioPlayer";

function Radio() {
  return (
    <div className="px-4 py-6 pb-36">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">📻 Radio</h1>
        <p className="text-white/60 text-sm mt-1">
          Nghe radio trực tuyến theo thể loại & tâm trạng
        </p>
      </header>

      {/* Filters */}
      <section className="mb-6">
        <RadioFilters />
      </section>

      {/* Station List */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">
          Danh sách kênh
        </h2>
        <RadioStationList />
      </section>

      {/* Mini Radio Player (fixed at bottom) */}
      <RadioPlayer />
    </div>
  );
}

export default Radio;
