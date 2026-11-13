/* @layer renderer-shell @kind logic */
import { nativePlugin } from '@drizztdourden08/brock-core';
import type { OrientationLock } from '../display.type';
import type { BrockDisplayPlugin } from './android/android-display.type';
import { DISPLAY_PLUGIN } from './android/android-display.constants';

const lockOrientation = async (mode: OrientationLock): Promise<boolean> => {
  const plugin = nativePlugin<BrockDisplayPlugin>(DISPLAY_PLUGIN);
  if (!plugin?.lockOrientation) return false;
  try {
    const { applied } = await plugin.lockOrientation({ mode });
    return applied;
  } catch {
    return false;
  }
};

export { lockOrientation };
