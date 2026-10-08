/* @layer renderer-shell @kind logic */
import type { SyncedRateStatus } from '../../display.type';
import { availableSyncedRates } from '../../rates/available-synced-rates';
import { bestSyncedRate } from '../../rates/best-synced-rate';
import { syncedRateMap } from '../../rates/synced-rate-map';
import { syncedTarget } from '../../rates/synced-target';
import type { AndroidRates, AndroidRateState, BrockDisplayPlugin, NativeDisplayInfo } from './android-display.type';
import { NO_SYNCED_RATE } from './android-display.constants';

const statusOf = (state: AndroidRateState, info: NativeDisplayInfo): SyncedRateStatus => {
  const currentHz = info.currentHz > 0 ? info.currentHz : null;
  return {
    supported: true,
    unsupportedReason: '',
    availableRates: availableSyncedRates(info.supportedHz),
    currentHz,
    activeHz: state.activeHz,
    bestHz: bestSyncedRate(currentHz),
    lastError: state.lastError,
  };
};

const createAndroidRates = (plugin: BrockDisplayPlugin): AndroidRates => {
  const state: AndroidRateState = { enabled: false, targetHz: 0, activeHz: null, lastError: '' };

  const prefer = async (label: number, exactHz: number): Promise<boolean> => {
    const result = await plugin.setPreferredRate({ hz: exactHz }).catch((error: unknown) => ({ applied: false, reason: String(error) }));
    state.lastError = result.applied ? '' : (result.reason ?? `Android refused ${label} Hz.`);
    return result.applied;
  };

  const request = async (info: NativeDisplayInfo, hz: number | null): Promise<void> => {
    const exactHz = hz === null ? undefined : syncedRateMap(info.supportedHz).get(hz);
    if (hz === null || exactHz === undefined) {
      state.lastError = hz === null ? NO_SYNCED_RATE : `This display does not offer ${hz} Hz.`;
      return;
    }
    if (await prefer(hz, exactHz)) state.activeHz = hz;
  };

  const status = async (): Promise<SyncedRateStatus> => statusOf(state, await plugin.getDisplayInfo());

  return {
    status,
    setPreference: async (enabled, targetHz) => {
      Object.assign(state, { enabled, targetHz, lastError: '' });
      const info = await plugin.getDisplayInfo();
      if (enabled) await request(info, syncedTarget(info.supportedHz, targetHz));
      else if (state.activeHz !== null && await prefer(0, 0)) state.activeHz = null;
      return statusOf(state, info);
    },
    apply: async (hz) => {
      const info = await plugin.getDisplayInfo();
      await request(info, hz);
      return statusOf(state, info);
    },
  };
};

export { createAndroidRates };
