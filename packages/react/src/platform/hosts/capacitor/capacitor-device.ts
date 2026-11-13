/* @layer renderer-shell @kind logic */
import { listenNative } from '@drizztdourden08/brock-core';
import type { BackEdge, DevicePort } from '@drizztdourden08/brock-core';
import { capacitorPlugins } from './capacitor-plugins';
import { BACK_EDGE_EVENT, LONGEST_VIBRATION_MS } from './capacitor.constants';

const ignore = (): void => undefined;

const edgeOf = (event: Event): BackEdge => ((event as CustomEvent<unknown>).detail === 'right' ? 'right' : 'left');

const backListeners = new Set<(edge: BackEdge) => void>();
const backEdge: { target: Window | null } = { target: null };

const onBackEdge = (event: Event): void => {
  if (backListeners.size === 0) capacitorPlugins.app()?.exitApp().catch(ignore);
  for (const listener of backListeners) listener(edgeOf(event));
};

const listenBackEdge = (): void => {
  if (backEdge.target === window || typeof window.addEventListener !== 'function') return;
  backEdge.target = window;
  window.addEventListener(BACK_EDGE_EVENT, onBackEdge);
};

const createCapacitorDevice = (): DevicePort => {
  listenBackEdge();
  return {
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
      backListeners.add(cb);
      const app = capacitorPlugins.app();
      const stopApp = app ? listenNative(app, 'backButton', () => { cb('left'); }) : ignore;
      return () => {
        backListeners.delete(cb);
        stopApp();
      };
    },
  };
};

export { createCapacitorDevice };
