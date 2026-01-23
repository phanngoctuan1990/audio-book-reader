import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const success = (message) => addToast(message, 'success');
  const error = (message) => addToast(message, 'error');
  const info = (message) => addToast(message, 'info');
  const warning = (message) => addToast(message, 'warning');

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-2 p-4 pt-safe pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ message, type }) {
  const styles = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    warning: 'bg-yellow-500/90',
    info: 'bg-primary/90',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div 
      className={`
        ${styles[type]} 
        text-white px-4 py-3 rounded-xl 
        flex items-center gap-3
        shadow-lg backdrop-blur-sm
        animate-in slide-in-from-top duration-300
        pointer-events-auto
      `}
    >
      <span className="text-lg">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
