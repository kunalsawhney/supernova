'use client';

import * as React from 'react';
import { type ToastActionElement, ToastProvider } from '@/components/ui/toast';

const TOAST_LIMIT = 5;
export const TOAST_REMOVE_DELAY = 1000 * 5; // 5 seconds

export type ToastProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
};

type ToasterToast = ToastProps & {
  dismiss: () => void;
};

// Create a context
const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  addToast: (toast: ToastProps) => void;
  dismissToast: (id: string) => void;
} | null>(null);

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const addToast = React.useCallback((toast: ToastProps) => {
    setToasts((prevToasts) => {
      // First, check if we're at the limit
      if (prevToasts.length >= TOAST_LIMIT) {
        return [...prevToasts.slice(1), { ...toast, dismiss: () => dismissToast(toast.id) }];
      }
      return [...prevToasts, { ...toast, dismiss: () => dismissToast(toast.id) }];
    });

    // Auto-dismiss after delay
    setTimeout(() => {
      dismissToast(toast.id);
    }, TOAST_REMOVE_DELAY);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = React.useMemo(
    () => ({ toasts, addToast, dismissToast }),
    [toasts, addToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, dismissToast } = context;

  return {
    toast: (props: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      addToast({ id, ...props });
    },
    dismiss: dismissToast,
  };
}

// Toast component
function Toast({
  id,
  title,
  description,
  action,
  variant = 'default',
  dismiss,
}: ToasterToast) {
  return (
    <div
      className={`
        p-4 rounded-lg shadow-lg min-w-[300px] max-w-md transform transition-all duration-300 
        flex items-start gap-3
        ${
          variant === 'destructive'
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-background text-foreground border border-border'
        }
      `}
      role="alert"
    >
      <div className="flex-1">
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <div className="flex items-start gap-2">
        {action}
        <button
          onClick={dismiss}
          className="h-6 w-6 rounded-full inline-flex items-center justify-center opacity-70 hover:opacity-100"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
} 