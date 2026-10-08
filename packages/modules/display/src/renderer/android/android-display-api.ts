/* @layer renderer-shell @kind logic */
import { nativePlugin } from '@drizztdourden08/brock-core';
import { exposeHostNamespace } from '@drizztdourden08/brock-react';
import type { DisplayApi } from '../../display.type';
import type { BrockDisplayPlugin } from './android-display.type';
import { DISPLAY_PLUGIN } from './android-display.constants';
import { createAndroidDisplayApi } from './create-android-display-api';

let made: { api: DisplayApi | null } | null = null;

const androidDisplayApi = (): DisplayApi | null => {
  if (!made) {
    const plugin = nativePlugin<BrockDisplayPlugin>(DISPLAY_PLUGIN);
    made = { api: plugin ? createAndroidDisplayApi(plugin) : null };
  }
  if (made.api) exposeHostNamespace('display', made.api);
  return made.api;
};

export { androidDisplayApi };
