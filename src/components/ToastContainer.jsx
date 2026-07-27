import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Zap,
} from 'lucide-react';

export default function ToastContainer({ toasts = [], onDismissToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-2">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 animate-fade-in flex items-start justify-between gap-3 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/10'
                : isError
                ? 'bg-red-950/90 border-red-500/50 text-red-100 shadow-red-500/10'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-500/10'
                : 'bg-neutral-900/90 border-neutral-700 text-neutral-100 shadow-neutral-900/40'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <XCircle className="w-5 h-5 text-red-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && (
                  <Zap className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="text-xs space-y-0.5">
                {toast.title && (
                  <div className="font-bold tracking-wide uppercase text-[11px] font-mono opacity-90">
                    {toast.title}
                  </div>
                )}
                <p className="leading-relaxed opacity-90">{toast.message}</p>
                {toast.action && (
                  <div className="pt-1.5">
                    <button
                      onClick={() => {
                        toast.action.onClick();
                        onDismissToast(toast.id);
                      }}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-[10px] tracking-wider uppercase border border-white/20 transition"
                    >
                      {toast.action.label}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismissToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
