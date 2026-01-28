/**
 * Favorites Page
 * Display user's bookmarked tracks
 */
function Favorites() {
  return (
    <div className="px-4 py-8 pb-32">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "#3D3428" }}>
          ❤️ Yêu thích
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8C857B" }}>
          Những cuốn sách bạn đã lưu để nghe lại
        </p>
      </header>

      {/* Empty state - Styled for Soft Gold theme */}
      <div className="bg-cream-50 rounded-3xl p-12 text-center shadow-soft-card border border-cream-400/30 stagger-item">
        <div className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft-3d-inset">
          <span className="text-5xl animate-bounce-soft">💜</span>
        </div>
        <h3 className="text-xl font-bold mb-3" style={{ color: "#3D3428" }}>
          Chưa có sách yêu thích
        </h3>
        <p
          className="text-sm max-w-[240px] mx-auto leading-relaxed"
          style={{ color: "#8C857B" }}
        >
          Mọi cuốn sách bạn yêu thích sẽ xuất hiện ở đây. Nhấn ❤️ khi nghe để
          lưu lại.
        </p>

        <button className="mt-8 px-8 py-3 bg-gold-400 text-white rounded-full font-bold shadow-soft-3d hover:bg-gold-500 transition-all active:scale-95">
          Khám phá ngay
        </button>
      </div>
    </div>
  );
}

export default Favorites;
