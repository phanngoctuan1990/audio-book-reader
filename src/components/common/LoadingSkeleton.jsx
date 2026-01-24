/**
 * LoadingSkeleton Component
 * Soft Gold theme skeleton loaders
 */
function LoadingSkeleton({ type = "card", count = 1 }) {
  const skeletons = Array(count).fill(null);

  if (type === "card") {
    return (
      <div className="space-y-3">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-xl bg-cream-50 shadow-soft-card border border-cream-400/30"
          >
            {/* Thumbnail skeleton */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl skeleton-gold flex-shrink-0" />
            {/* Content skeleton */}
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 skeleton-gold rounded w-3/4" />
              <div className="h-3 skeleton-gold rounded w-1/2" />
              <div className="h-3 skeleton-gold rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-cream-50 rounded-2xl overflow-hidden shadow-soft-card border border-cream-400/30"
          >
            {/* Thumbnail skeleton */}
            <div className="aspect-video skeleton-gold" />
            {/* Content skeleton */}
            <div className="p-3 sm:p-4 space-y-2">
              <div className="h-4 skeleton-gold rounded w-full" />
              <div className="h-3 skeleton-gold rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "player") {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl skeleton-gold shadow-soft-3d" />
        <div className="h-6 skeleton-gold rounded w-48" />
        <div className="h-4 skeleton-gold rounded w-32" />
        <div className="h-2 skeleton-gold rounded w-full mt-4" />
        <div className="flex gap-4 mt-4">
          <div className="w-12 h-12 rounded-full skeleton-gold" />
          <div className="w-16 h-16 rounded-full skeleton-gold shadow-soft-3d" />
          <div className="w-12 h-12 rounded-full skeleton-gold" />
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-2 sm:space-y-3">
        {skeletons.map((_, i) => (
          <div key={i} className="flex gap-3 p-2 sm:p-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl skeleton-gold flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 skeleton-gold rounded w-3/4" />
              <div className="h-3 skeleton-gold rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "compact") {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {skeletons.map((_, i) => (
          <div key={i} className="flex-shrink-0 w-32">
            <div className="aspect-square rounded-2xl skeleton-gold shadow-soft-card mb-2" />
            <div className="h-4 skeleton-gold rounded w-full mb-1" />
            <div className="h-3 skeleton-gold rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // Default: simple line skeleton
  return (
    <div className="space-y-2">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="h-4 skeleton-gold rounded"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
