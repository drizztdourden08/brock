/* @layer renderer-shell @kind logic */
import { toast as raise } from '@drizztdourden08/tessera/composites';
import type { ToastInput } from '@drizztdourden08/tessera/composites';
import type { ToastOptions } from './toast.type';

const toastInput = (message: string, { variant, duration, action, onClose }: ToastOptions): ToastInput => ({
  message,
  ...(variant === undefined ? {} : { variant }),
  ...(duration === undefined ? {} : { duration }),
  ...(action === undefined ? {} : { action }),
  ...(onClose === undefined ? {} : { onClose }),
});

const toast = (message: string, options: ToastOptions = {}): string => raise(toastInput(message, options));

export { toast };
