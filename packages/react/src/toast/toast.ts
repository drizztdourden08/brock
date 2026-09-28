/* @layer renderer-shell @kind logic */
import { TOAST_DURATION_MS } from './toast.constants';
import type { ToastOptions } from './toast.type';
import { useToastStore } from './useToastStore';

let nextToastId = 0;

const toast = (message: string, options: ToastOptions = {}): string => {
  const { variant = 'info', duration = TOAST_DURATION_MS } = options;
  nextToastId += 1;
  const id = `toast-${nextToastId}`;
  useToastStore.getState().push({ id, message, variant, duration });
  return id;
};

export { toast };
