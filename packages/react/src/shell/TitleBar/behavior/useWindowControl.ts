/* @layer renderer-shell @kind hook */
import type { WindowControl } from '@drizztdourden08/tessera/composites';
import { usePlatform } from '../../../platform/usePlatform';
import { requestQuit } from '../../../quit/request-quit';
import { usePinWindow } from './usePinWindow';

const useWindowControl = () => {
  const { window: win } = usePlatform();
  const { pinned, togglePin } = usePinWindow();
  const actions: Record<WindowControl, () => void> = {
    fullscreen: () => win.toggleFullscreen(),
    pin: () => void togglePin(),
    minimize: () => win.minimize(),
    maximize: () => win.toggleMaximize(),
    close: () => void requestQuit(() => win.close()),
  };
  return { pinned, onControl: (control: WindowControl): void => actions[control]() };
};

export { useWindowControl };
