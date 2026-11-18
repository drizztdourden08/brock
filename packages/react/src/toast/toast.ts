/* @layer renderer-shell @kind logic */
import { toast as raise } from '@drizztdourden08/tessera/composites';
import type { ToastInput } from '@drizztdourden08/tessera/composites';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { controlSources } from '../app/control-sources';
import type { ToastOptions } from './toast.type';

const toastInput = (message: Text, { variant, duration, action, onClose }: ToastOptions): ToastInput => {
  const { text } = controlSources.get();
  return {
    message: text(message),
    ...(variant === undefined ? {} : { variant }),
    ...(duration === undefined ? {} : { duration }),
    ...(action === undefined ? {} : { action: { ...action, label: text(action.label) } }),
    ...(onClose === undefined ? {} : { onClose }),
  };
};

const toast = (message: Text, options: ToastOptions = {}): string => raise(toastInput(message, options));

export { toast };
