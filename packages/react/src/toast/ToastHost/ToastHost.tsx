/* @layer renderer-shell @kind component */
import { ToastContainer } from '@drizztdourden08/tessera/primitives';
import { useToastStore } from '../useToastStore';

const ToastHost = () => {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return <ToastContainer toasts={toasts} onDismiss={dismiss} position="bottom-right" />;
};

export { ToastHost };
