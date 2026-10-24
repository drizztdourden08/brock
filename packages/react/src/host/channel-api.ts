/* @layer renderer-shell @kind logic */
import type { ChannelApi, IpcApi } from '@drizztdourden08/brock-core';
import { isAskChannel } from './is-ask-channel';
import { requireHostApi } from './require-host-api';

const channelApi = <D extends object>(channels: D): IpcApi & ChannelApi<D> => {
  const api = requireHostApi();
  const missing = Object.entries(channels)
    .filter(([method, decl]) => method !== 'maps' && !isAskChannel(decl) && !(method in api))
    .map(([method]) => method);
  if (missing.length > 0) throw new Error(`window.api has no ${missing.join(', ')}: electron/preload.ts must compose the channel maps (APP_CHANNELS.maps)`);
  return api as IpcApi & ChannelApi<D>;
};

export { channelApi };
