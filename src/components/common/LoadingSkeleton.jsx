function LoadingSkeleton({ type = 'card', count = 1 }) {
  const skeletons = Array(count).fill(null);

  if (type === 'card') {
    return (
      <div className="space-y-3">
        {skeletons.map((_, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-xl bg-dark-800">
            {/* Thumbnail skeleton */}
            <div className="w-20 h-20 rounded-lg skeleton flex-shrink-0" />
            {/* Content skeleton */}
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
              <div className="h-3 skeleton rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'player') {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-48 h-48 rounded-full skeleton" />
        <div className="h-6 skeleton rounded w-48" />
        <div className="h-4 skeleton rounded w-32" />
        <div className="h-2 skeleton rounded w-full mt-4" />
        <div className="flex gap-4 mt-4">
          <div className="w-12 h-12 rounded-full skeleton" />
          <div className="w-16 h-16 rounded-full skeleton" />
          <div className="w-12 h-12 rounded-full skeleton" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-2">
        {skeletons.map((_, i) => (
          <div key={i} className="flex gap-3 p-2">
            <div className="w-12 h-12 rounded-lg skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: simple line skeleton
  return (
    <div className="space-y-2">
      {skeletons.map((_, i) => (
        <div key={i} className="h-4 skeleton rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
