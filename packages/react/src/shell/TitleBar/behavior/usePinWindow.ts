/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import { usePlatform } from '../../../platform/usePlatform';

const usePinWindow = () => {
  const { window: win } = usePlatform();
  const [pinned, setPinned] = useState(false);
  const togglePin = async (): Promise<void> => setPinned(await win.setAlwaysOnTop(!pinned));
  return { pinned, togglePin };
};

export { usePinWindow };
