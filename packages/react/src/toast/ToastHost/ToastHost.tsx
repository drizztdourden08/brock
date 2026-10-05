/* @layer renderer-shell @kind component */
import { ToastStack } from '@drizztdourden08/tessera/composites';
import { MAX_TOASTS, TOAST_POSITION } from '../toast.constants';

const ToastHost = () => <ToastStack position={TOAST_POSITION} max={MAX_TOASTS} />;

export { ToastHost };
