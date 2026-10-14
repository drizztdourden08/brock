/* @layer renderer-shell @kind logic */
import { listenNative } from '@drizztdourden08/brock-core';
import type { DevicePort } from '@drizztdourden08/brock-core';
import { capacitorPlugins } from './capacitor-plugins';
import { LONGEST_VIBRATION_MS } from './capacitor.constants';

const ignore = (): void => undefined;

const createCapacitorDevice = (): DevicePort => ({
  keepAwake: () => { capacitorPlugins.keepAwake()?.keepAwake().catch(ignore); },
  allowSleep: () => { capacitorPlugins.keepAwake()?.allowSleep().catch(ignore); },
  vibrate: (durationMs) => {
    const duration = Math.max(1, Math.min(LONGEST_VIBRATION_MS, Math.round(durationMs)));
    capacitorPlugins.haptics()?.vibrate({ duration }).catch(ignore);
  },
  onAppPause: (cb) => {
    const app = capacitorPlugins.app();
    return app ? listenNative<{ isActive: boolean }>(app, 'appStateChange', ({ isActive }) => { if (!isActive) cb(); }) : ignore;
  },
  onBackButton: (cb) => {
    const app = capacitorPlugins.app();
    return app ? listenNative(app, 'backButton', () => { cb('left'); }) : ignore;
  },
});

export { createCapacitorDevice };
