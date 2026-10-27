/* @layer renderer-shell @kind types */
import type { ToastAction, ToastCloseReason, ToastVariant } from '@drizztdourden08/tessera/composites';

interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
  onClose?: (reason: ToastCloseReason) => void;
}

export type { ToastOptions };
