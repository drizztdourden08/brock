/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ToastAction, ToastCloseReason, ToastVariant } from '@drizztdourden08/tessera/composites';

type ToastActionDef = Omit<ToastAction, 'label'> & { label: Text };

interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;
  action?: ToastActionDef;
  onClose?: (reason: ToastCloseReason) => void;
}

export type { ToastOptions };
