import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Popups Floating Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg text-xs transition-all duration-300 animate-in slide-in-from-top-2 fade-in ${
              toast.type === 'success'
                ? 'bg-[#FEFEFE] border-[#287A52]/30 text-[#0C1629] shadow-[#287A52]/10'
                : toast.type === 'error'
                ? 'bg-[#FEFEFE] border-[#B54747]/30 text-[#0C1629] shadow-[#B54747]/10'
                : 'bg-[#FEFEFE] border-[#356B9A]/30 text-[#0C1629] shadow-[#356B9A]/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-[#287A52]/15 flex items-center justify-center text-[#287A52]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : toast.type === 'error' ? (
                <div className="w-5 h-5 rounded-full bg-[#B54747]/15 flex items-center justify-center text-[#B54747]">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#356B9A]/15 flex items-center justify-center text-[#356B9A]">
                  <Info className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 leading-relaxed">
              <span className="font-semibold block text-[11px] uppercase tracking-wider text-[#727A84]">
                {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Notice' : 'Information'}
              </span>
              <p className="font-medium text-[#0C1629] mt-0.5">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#727A84] hover:text-[#0C1629] p-1 rounded transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
