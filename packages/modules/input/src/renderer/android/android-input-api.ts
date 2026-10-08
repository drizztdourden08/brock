/* @layer renderer-shell @kind logic */
import { nativePlugin } from '@drizztdourden08/brock-core';
import { exposeHostNamespace } from '@drizztdourden08/brock-react';
import type { InputApi } from '../../input-api.type';
import type { BrockInputPlugin } from './android-input.type';
import { INPUT_PLUGIN } from './android-input.constants';
import { createAndroidInputApi } from './create-android-input-api';

let made: { api: InputApi | null } | null = null;

const androidInputApi = (): InputApi | null => {
  if (!made) {
    const plugin = nativePlugin<BrockInputPlugin>(INPUT_PLUGIN);
    made = { api: plugin ? createAndroidInputApi(plugin) : null };
  }
  if (made.api) exposeHostNamespace('input', made.api);
  return made.api;
};

export { androidInputApi };
