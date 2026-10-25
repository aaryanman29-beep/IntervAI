import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => {
      // Prevent rapid duplicate toast submissions
      const isDuplicate = prev.some((t) => t.message === message && t.type === type);
      if (isDuplicate) return prev;
      return [...prev.slice(-4), { id, type, title, message }]; // keep at most 5
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (message, title = "Success") => addToast({ type: "success", title, message }),
    error: (message, title = "Error") => addToast({ type: "error", title, message }),
    warning: (message, title = "Warning") => addToast({ type: "warning", title, message }),
    info: (message, title = "Info") => addToast({ type: "info", title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg transition-all page-enter ${
              t.type === "success"
                ? "border-emerald-200 bg-white text-emerald-950"
                : t.type === "error"
                ? "border-red-200 bg-white text-red-950"
                : t.type === "warning"
                ? "border-amber-200 bg-white text-amber-950"
                : "border-line bg-white text-ink"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="size-5 text-emerald-600" />}
              {t.type === "error" && <AlertCircle className="size-5 text-red-600" />}
              {t.type === "warning" && <AlertTriangle className="size-5 text-amber-600" />}
              {t.type === "info" && <Info className="size-5 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-bold leading-tight">{t.title}</p>}
              <p className="text-xs text-muted mt-0.5 break-words">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted hover:text-ink transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
