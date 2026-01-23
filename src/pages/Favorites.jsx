function Favorites() {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          ❤️ Yêu thích
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Sách đã lưu
        </p>
      </header>

      {/* Empty state */}
      <div className="bg-dark-800 rounded-2xl p-8 text-center">
        <span className="text-5xl mb-4 block">💜</span>
        <h3 className="text-white font-semibold mb-2">Chưa có sách yêu thích</h3>
        <p className="text-white/60 text-sm">
          Nhấn ❤️ để thêm sách vào danh sách yêu thích
        </p>
      </div>
    </div>
  );
}

export default Favorites;
