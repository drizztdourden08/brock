/* @layer electron-main @kind logic */
import { resolveTarget } from './resolve-target';
import { syncedRateMap } from './synced-rate-map';
import type { SyncedRateState } from './synced-rate.type';

const switchFailure = (state: SyncedRateState): string | null => {
  const target = resolveTarget(state);
  if (target === null) return 'This display offers no refresh rate that is a multiple of 60.';
  const exactRate = syncedRateMap(state.driver).get(target);
  if (exactRate === undefined) return `This display no longer offers ${target} Hz.`;
  const current = state.driver.currentRate();
  if (current === exactRate) return null;
  if (!state.driver.setRate(exactRate)) return `The system refused to switch this display to ${target} Hz.`;
  if (state.rateToRestore === null && current !== null) state.rateToRestore = current;
  return null;
};

const applyForFullscreen = (state: SyncedRateState): void => {
  state.lastError = '';
  if (!state.preference.enabled || !state.driver.available) return;
  state.lastError = switchFailure(state) ?? '';
};

export { applyForFullscreen };
