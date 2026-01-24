/**
 * RadioStationList Component
 * Display list of radio stations with one-click play
 */
import { useRadio } from "../../contexts/RadioContext";

function RadioStationList() {
  const { stations, currentStation, isPlaying, isLoading, loadStation } =
    useRadio();

  if (stations.length === 0) {
    return (
      <div className="bg-dark-800 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-3 block">📻</span>
        <h3 className="text-white font-semibold mb-2">Không có kênh phù hợp</h3>
        <p className="text-white/60 text-sm">
          Thử thay đổi bộ lọc để xem các kênh khác
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
              flex items-center gap-3 p-4 rounded-xl
              text-left transition-all duration-200
              active:scale-[0.98]
              ${
                isCurrentStation
                  ? "bg-gradient-to-r from-accent-purple/20 to-primary/20 border border-primary/50"
                  : "bg-dark-800 hover:bg-dark-700 border border-transparent"
              }
            `}
          >
            {/* Station icon */}
            <div
              className={`
              relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
              ${
                isCurrentPlaying
                  ? "bg-gradient-to-br from-accent-purple to-primary"
                  : "bg-dark-600"
              }
            `}
            >
              <span className="text-2xl">📻</span>

              {/* Playing indicator */}
              {isCurrentPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Station info */}
            <div className="flex-1 min-w-0">
              <h4
                className={`
                font-medium text-sm truncate
                ${isCurrentStation ? "text-primary" : "text-white"}
              `}
              >
                {station.name}
              </h4>
              <p className="text-white/60 text-xs truncate mt-0.5">
                {station.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${
                    isCurrentStation
                      ? "bg-primary/30 text-primary"
                      : "bg-dark-600 text-white/50"
                  }
                `}
                >
                  {station.genre}
                </span>
                {isCurrentPlaying && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
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
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/60"
              }
              transition-colors
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
