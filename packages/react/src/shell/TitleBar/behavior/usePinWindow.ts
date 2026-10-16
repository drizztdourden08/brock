/* @layer renderer-shell @kind hook */
import { usePlatform } from '../../../platform/usePlatform';
import { togglePin } from './toggle-pin';
import { usePinStore } from './usePinStore';

const usePinWindow = () => {
  const { window: win } = usePlatform();
  const pinned = usePinStore((s) => s.pinned);
  return { pinned, togglePin: (): Promise<void> => togglePin(win) };
};

export { usePinWindow };
