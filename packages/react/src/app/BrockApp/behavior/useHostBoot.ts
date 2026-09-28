/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { BASE_EVENT_MAP, BASE_INVOKE_MAP, BASE_SEND_MAP, detectHost } from '@drizztdourden08/brock-core';
import { createAppLog } from '../../../log/create-app-log';
import { exposeLogGlobals } from '../../../log/expose-log-globals';
import type { AppLogBus } from '../../../log/app-log.type';
import { configureProfileStore } from '../../../profiles/configure-profile-store';
import { installApiShim } from '../../../platform/api-shim';

const useHostBoot = (logChannels: readonly string[], profileHooks?: ProfileStoreHooks): AppLogBus =>
  useMemo(() => {
    if (detectHost() !== 'electron') {
      installApiShim({ invoke: BASE_INVOKE_MAP, send: BASE_SEND_MAP, events: BASE_EVENT_MAP });
    }
    if (profileHooks) configureProfileStore(profileHooks);
    const bus = createAppLog(logChannels);
    if (import.meta.env.DEV) exposeLogGlobals(bus);
    return bus;
  }, []);

export { useHostBoot };
