import { useState, useEffect } from 'react';
import { isIOS, isStandalone } from '../../utils/helpers';

function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    if (localStorage.getItem('installBannerDismissed') === 'true') {
      setDismissed(true);
      return;
    }

    // Check if already installed
    if (isStandalone()) {
      return;
    }

    // Handle beforeinstallprompt for Android/Chrome
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show custom guide
    if (isIOS() && !isStandalone()) {
      setShowIOSGuide(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowIOSGuide(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  // Don't show if dismissed or not installable
  if (dismissed || (!isInstallable && !showIOSGuide)) return null;

  // iOS Guide Modal
  if (showIOSGuide) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-end z-50 animate-in fade-in">
        <div className="bg-dark-800 rounded-t-3xl p-6 w-full max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">📱 Cài đặt Vibe Audio</h3>
            <button 
              onClick={handleDismiss}
              className="text-white/60 text-2xl touch-target"
            >
              ×
            </button>
          </div>
          
          <p className="text-white/70 mb-4">
            Thêm vào màn hình chính để trải nghiệm tốt nhất:
          </p>
          
          <ol className="space-y-4 text-white/90">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">1</span>
              <span>Nhấn nút <strong className="text-primary">Chia sẻ</strong> ↗️ ở thanh dưới cùng Safari</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">2</span>
              <span>Cuộn xuống và chọn <strong className="text-primary">"Thêm vào MH chính"</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">3</span>
              <span>Nhấn <strong className="text-primary">"Thêm"</strong> ở góc trên phải</span>
            </li>
          </ol>

          <button 
            onClick={handleDismiss}
            className="w-full mt-6 bg-gradient-primary text-white py-4 rounded-xl font-semibold active:scale-98 transition-transform"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    );
  }

  // Android/Chrome install banner
  return (
    <div className="fixed bottom-32 left-4 right-4 z-50 animate-in slide-in-from-bottom">
      <div className="bg-gradient-to-r from-primary to-accent-blue rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-white font-semibold">📱 Cài đặt Vibe Audio</p>
            <p className="text-white/80 text-sm">Thêm vào màn hình chính</p>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-white/60 px-2 py-1 touch-target"
          >
            Sau
          </button>
          <button 
            onClick={handleInstall}
            className="bg-white text-primary px-4 py-2 rounded-xl font-semibold active:scale-95 transition-transform"
          >
            Cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallBanner;
