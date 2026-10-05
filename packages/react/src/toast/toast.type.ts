/* @layer renderer-shell @kind types */
import type { ToastAction, ToastItem, ToastVariant } from '@drizztdourden08/tessera/composites';

interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

interface ToastState {
  toasts: ToastItem[];
  push: (item: ToastItem) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export type { ToastOptions, ToastState };
