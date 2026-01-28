/**
 * RadioStationList Component
 * Display list of radio stations with one-click play
 * Updated for Soft Gold theme and clear readability
 */
import { useRadio } from "../../contexts/RadioContext";

function RadioStationList() {
  const { stations, currentStation, isPlaying, isLoading, loadStation } =
    useRadio();

  if (stations.length === 0) {
    return (
      <div className="bg-cream-50 rounded-2xl p-6 text-center border border-cream-400/30">
        <span className="text-4xl mb-3 block">📻</span>
        <h3 className="text-cream-900 font-semibold mb-2">
          Không có kênh phù hợp
        </h3>
        <p className="text-cream-600 text-sm">
          Thực hiện thay đổi bộ lọc để xem các kênh khác
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {stations.map((station) => {
        const isCurrentStation = currentStation?.id === station.id;
        const isCurrentPlaying = isCurrentStation && isPlaying;

        return (
          <button
            key={station.id}
            onClick={() => loadStation(station)}
            disabled={isCurrentStation && isLoading}
            className={`
              flex items-center gap-4 p-4 rounded-xl
              text-left transition-all duration-200
              active:scale-[0.98] border
              ${
                isCurrentStation
                  ? "bg-gold-50 border-gold-300 shadow-soft-card"
                  : "bg-cream-50 hover:bg-cream-100/50 border-cream-400/30"
              }
            `}
          >
            {/* Station icon */}
            <div
              className={`
              relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
              ${
                isCurrentPlaying
                  ? "bg-gradient-to-br from-gold-400 to-gold-600 shadow-soft-3d-sm"
                  : "bg-cream-200"
              }
            `}
            >
              <span className="text-2xl">📻</span>

              {/* Playing indicator */}
              {isCurrentPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                  <div className="flex gap-0.5 h-4">
                    <span
                      className="w-1 bg-white rounded-full animate-pulse"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1 bg-white rounded-full animate-pulse"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1 bg-white rounded-full animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isCurrentStation && isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Station info */}
            <div className="flex-1 min-w-0">
              <h4
                className={`
                font-semibold text-sm truncate
                ${isCurrentStation ? "text-gold-700" : "text-cream-900"}
              `}
              >
                {station.name}
              </h4>
              <p className="text-cream-600 text-xs truncate mt-0.5">
                {station.description}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`
                  px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase
                  ${
                    isCurrentStation
                      ? "bg-gold-200 text-gold-800"
                      : "bg-cream-200 text-cream-700"
                  }
                `}
                >
                  {station.genre}
                </span>
                {isCurrentPlaying && (
                  <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
            </div>

            {/* Play icon */}
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${
                isCurrentPlaying
                  ? "bg-gold-500 text-white shadow-soft-3d-sm"
                  : "bg-cream-300/50 text-cream-700 hover:bg-cream-300"
              }
              transition-all
            `}
            >
              {isCurrentPlaying ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default RadioStationList;
