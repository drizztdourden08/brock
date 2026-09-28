/* @layer electron-main @kind logic */
import type { DisplayModeDriver } from '../display-mode-driver.type';
import { WAYLAND_REASON } from './linux.constants';
import type { XrandrState } from './linux.type';
import { parseXrandr } from './parse-xrandr';
import { runXrandr } from './run-xrandr';

const readState = (): XrandrState | null => {
  const out = runXrandr([]);
  return out ? parseXrandr(out) : null;
};

const listRates = (): number[] => readState()?.rates ?? [];

const currentRate = (): number | null => readState()?.currentRate ?? null;

const setRate = (hz: number): boolean => {
  const state = readState();
  if (!state) return false;
  const result = runXrandr(['--output', state.output, '--mode', state.resolution, '--rate', String(hz)]);
  if (result === null) return false;
  return currentRate() === hz;
};

const createLinuxDriver = (): DisplayModeDriver => {
  const probe = readState();
  const ready = probe !== null && probe.rates.length > 0;
  return {
    platform: 'linux',
    available: ready,
    unavailableReason: ready ? '' : WAYLAND_REASON,
    listRates,
    currentRate,
    setRate,
  };
};

export { createLinuxDriver };
