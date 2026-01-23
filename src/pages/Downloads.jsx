function Downloads() {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          ⬇️ Offline
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Sách đã tải để nghe offline
        </p>
      </header>

      {/* Storage info placeholder */}
      <div className="bg-dark-700 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">Dung lượng đã dùng</span>
          <span className="text-white text-sm font-medium">0 MB / 500 MB</span>
        </div>
        <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary w-0" />
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-dark-800 rounded-2xl p-8 text-center">
        <span className="text-5xl mb-4 block">📥</span>
        <h3 className="text-white font-semibold mb-2">Chưa có sách offline</h3>
        <p className="text-white/60 text-sm">
          Tải sách về để nghe khi không có mạng
        </p>
      </div>
    </div>
  );
}

export default Downloads;
