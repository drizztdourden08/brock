/* @layer renderer-shell @kind logic */
import type { WindowControlsPort } from '@drizztdourden08/brock-core';
import { usePinStore } from './usePinStore';

const togglePin = async (win: Pick<WindowControlsPort, 'setAlwaysOnTop'>): Promise<void> => {
  const { pinned, setPinned } = usePinStore.getState();
  setPinned(await win.setAlwaysOnTop(!pinned));
};

export { togglePin };
