import { CheckCircle2, X } from 'lucide-react';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const ToastContext = createContext<{ showToast: (message: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const value = useMemo(() => ({
    showToast: (next: string) => {
      setMessage(next);
      window.setTimeout(() => setMessage(''), 2600);
    },
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-lg bg-zinc-950 px-4 py-3 text-white shadow-2xl dark:bg-white dark:text-zinc-950">
          <CheckCircle2 className="h-5 w-5 text-gallery-red" />
          <span className="font-semibold">{message}</span>
          <button type="button" onClick={() => setMessage('')} aria-label="Close toast"><X className="h-4 w-4" /></button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside ToastProvider');
  return value;
}
