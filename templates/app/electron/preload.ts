/* @layer electron-preload @kind entry */
import { BASE_EVENT_MAP, BASE_INVOKE_MAP, BASE_SEND_MAP, composeMaps } from '@drizztdourden08/brock-core';
import { createPreloadBridge } from '@drizztdourden08/brock-electron/preload';
import { preloadNamespaces } from '../.brock/modules.preload';
import { APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP } from '../src/ipc/contract.constants';

createPreloadBridge({
  maps: {
    invoke: composeMaps(BASE_INVOKE_MAP, APP_INVOKE_MAP),
    send: composeMaps(BASE_SEND_MAP, APP_SEND_MAP),
    events: composeMaps(BASE_EVENT_MAP, APP_EVENT_MAP),
  },
  namespaces: preloadNamespaces,
});
