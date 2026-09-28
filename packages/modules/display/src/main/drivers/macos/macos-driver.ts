/* @layer electron-main @kind logic */
import type { DisplayModeDriver } from '../display-mode-driver.type';
import { asNumber } from '../koffi/as-number';
import { macBindings } from './mac-bindings';
import type { MacBindings } from './macos.type';
import { withCurrentModes } from './with-current-modes';

const rateOf = (api: MacBindings, mode: unknown): number => Math.round(asNumber(api.refreshRate(mode)));

const listRates = (): number[] => withCurrentModes(({ api, modes }) => {
  const rates = new Set(modes.map((mode) => rateOf(api, mode)).filter((hz) => hz > 0));
  return [...rates].sort((a, b) => a - b);
}, []);

const currentRate = (): number | null => withCurrentModes(({ api, current }) => {
  const hz = rateOf(api, current);
  return hz > 0 ? hz : null;
}, null);

const setRate = (hz: number): boolean => withCurrentModes(({ api, modes }) => {
  const match = modes.find((mode) => rateOf(api, mode) === hz);
  if (!match) return false;
  return api.setMode(api.mainDisplayId(), match, null) === 0;
}, false);

const createMacDriver = (): DisplayModeDriver => {
  const { api, error } = macBindings();
  return {
    platform: 'darwin',
    available: api !== null,
    unavailableReason: api ? '' : error,
    listRates,
    currentRate,
    setRate,
  };
};

export { createMacDriver };
