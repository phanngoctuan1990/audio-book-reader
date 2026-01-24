/**
 * EmptyState Component
 * Soft Gold theme empty state with 3D illustration
 */
import { BookOpen, Download, Search, Heart, Radio } from "lucide-react";

const VARIANTS = {
  default: {
    icon: BookOpen,
    title: "Chưa có nội dung",
    description: "Bắt đầu khám phá và thêm sách nói vào thư viện của bạn",
    actionLabel: "Khám phá ngay",
  },
  search: {
    icon: Search,
    title: "Không tìm thấy kết quả",
    description: "Thử tìm với từ khóa khác hoặc kiểm tra chính tả",
    actionLabel: "Xóa bộ lọc",
  },
  favorites: {
    icon: Heart,
    title: "Chưa có yêu thích",
    description: "Nhấn ❤️ để lưu sách nói yêu thích của bạn",
    actionLabel: "Khám phá ngay",
  },
  downloads: {
    icon: Download,
    title: "Chưa có tải xuống",
    description: "Tải xuống sách nói để nghe khi không có mạng",
    actionLabel: "Tải xuống ngay",
  },
  library: {
    icon: BookOpen,
    title: "Thư viện trống",
    description: "Thêm sách nói vào thư viện để dễ dàng truy cập",
    actionLabel: "Thêm sách",
  },
  radio: {
    icon: Radio,
    title: "Không có kênh radio",
    description: "Chọn thể loại để xem danh sách kênh radio",
    actionLabel: "Chọn thể loại",
  },
};

function EmptyState({
  variant = "default",
  title,
  description,
  actionLabel,
  onAction,
  showAction = true,
}) {
  const config = VARIANTS[variant] || VARIANTS.default;
  const IconComponent = config.icon;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = actionLabel || config.actionLabel;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
      {/* 3D Illustration Container */}
      <div className="relative mb-6">
        {/* Background circle with soft shadow */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-cream-50 shadow-soft-3d flex items-center justify-center">
          {/* Inner circle with gradient */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center shadow-soft-3d-inset">
            <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-gold-600" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold-400 shadow-soft-3d-sm opacity-60" />
        <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-gold-300 shadow-soft-3d-sm opacity-40" />
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-cream-900 mb-2">
        {displayTitle}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-cream-600 max-w-xs mb-6">
        {displayDescription}
      </p>

      {/* Action Button */}
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 btn-gold-3d font-semibold text-sm sm:text-base min-h-[44px]
                     flex items-center gap-2"
        >
          {variant === "downloads" && <Download className="w-4 h-4" />}
          {displayActionLabel}
        </button>
      )}

      {/* Secondary action or hint */}
      {variant === "search" && (
        <p className="text-xs text-cream-500 mt-4">
          💡 Mẹo: Dán URL YouTube để phát trực tiếp
        </p>
      )}
    </div>
  );
}

export default EmptyState;
