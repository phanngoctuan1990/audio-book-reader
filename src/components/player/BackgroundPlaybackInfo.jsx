/**
 * BackgroundPlaybackInfo Component
 * Informs users about background playback feature and requirements
 */
import { useState, useEffect } from "react";
import { isMediaSessionSupported } from "../../services/mediaSession";
import { isWakeLockSupported } from "../../services/wakeLock";

function BackgroundPlaybackInfo({ onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenInfo, setHasSeenInfo] = useState(false);

  useEffect(() => {
    // Check if user has already seen this info
    const seen = localStorage.getItem("backgroundPlaybackInfoSeen");
    if (!seen) {
      setIsVisible(true);
    } else {
      setHasSeenInfo(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("backgroundPlaybackInfoSeen", "true");
    setHasSeenInfo(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible || hasSeenInfo) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const mediaSessionSupported = isMediaSessionSupported();
  const wakeLockSupported = isWakeLockSupported();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-dark-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-primary">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎵</span>
            <div>
              <h2 className="text-lg font-bold text-white">Phát nhạc nền</h2>
              <p className="text-sm text-white/80">
                Nghe nhạc khi tắt màn hình
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Feature status */}
          <div className="flex items-center gap-2 text-sm">
            {mediaSessionSupported ? (
              <>
                <span className="text-green-400">✓</span>
                <span className="text-white/80">
                  Điều khiển từ màn hình khóa
                </span>
              </>
            ) : (
              <>
                <span className="text-yellow-400">!</span>
                <span className="text-white/60">
                  Trình duyệt không hỗ trợ đầy đủ
                </span>
              </>
            )}
          </div>

          {/* Platform-specific instructions */}
          <div className="space-y-3">
            <p className="text-sm text-white/70">Để có trải nghiệm tốt nhất:</p>

            <ul className="space-y-2 text-sm">
              {isIOS && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">📱</span>
                    <span className="text-white/80">
                      Thêm app vào Home Screen để sử dụng như ứng dụng gốc
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">🔇</span>
                    <span className="text-white/80">
                      Tắt chế độ Im lặng (Silent Mode) để nghe âm thanh
                    </span>
                  </li>
                </>
              )}

              {isAndroid && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">🔔</span>
                    <span className="text-white/80">
                      Cho phép thông báo để điều khiển từ notification
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">⚡</span>
                    <span className="text-white/80">
                      Tắt tối ưu pin cho trình duyệt/app này
                    </span>
                  </li>
                </>
              )}

              {!isIOS && !isAndroid && (
                <li className="flex items-start gap-2">
                  <span className="text-primary">💻</span>
                  <span className="text-white/80">
                    Giữ tab mở để tiếp tục nghe nhạc nền
                  </span>
                </li>
              )}

              <li className="flex items-start gap-2">
                <span className="text-primary">🎧</span>
                <span className="text-white/80">
                  Sử dụng tai nghe để điều khiển qua nút bấm
                </span>
              </li>
            </ul>
          </div>

          {/* Features list */}
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-white/50 mb-2">Tính năng hỗ trợ:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                ▶️ Play/Pause
              </span>
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                ⏮️ Previous
              </span>
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                ⏭️ Next
              </span>
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                ⏪ Seek
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-gradient-primary text-white font-medium rounded-xl active:scale-[0.98] transition-transform touch-target"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundPlaybackInfo;
