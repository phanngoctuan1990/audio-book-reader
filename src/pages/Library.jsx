function Library() {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          📚 Thư viện
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Lịch sử nghe và Playlist
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['Đang nghe', 'Lịch sử', 'Playlist'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target
              ${i === 0 
                ? 'bg-gradient-primary text-white' 
                : 'bg-dark-700 text-white/60 hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-dark-800 rounded-2xl p-8 text-center">
        <span className="text-5xl mb-4 block">📖</span>
        <h3 className="text-white font-semibold mb-2">Chưa có gì ở đây</h3>
        <p className="text-white/60 text-sm">
          Bắt đầu nghe sách để xem lịch sử của bạn
        </p>
      </div>
    </div>
  );
}

export default Library;
