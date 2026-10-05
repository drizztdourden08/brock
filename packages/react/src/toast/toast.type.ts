/* @layer renderer-shell @kind types */
import type { ToastAction, ToastVariant } from '@drizztdourden08/tessera/composites';

interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

export type { ToastOptions };
