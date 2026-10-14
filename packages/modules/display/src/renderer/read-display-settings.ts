/* @layer renderer-shell @kind logic */
import { detectHost } from '@drizztdourden08/brock-core';
import type { HostShell } from '@drizztdourden08/brock-core';
import { displayDefaultsFor } from '../display-defaults-for';
import type { DisplaySettings, WindowMode } from '../display.type';

const isWindowMode = (value: unknown): value is WindowMode =>
  value === 'windowed' || value === 'borderless' || value === 'fullscreen';

const pick = <T>(value: unknown, fallback: T, valid: (candidate: unknown) => candidate is T): T =>
  valid(value) ? value : fallback;

const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isRate = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;

const readDisplaySettings = (settings: object, host: HostShell = detectHost()): DisplaySettings => {
  const record: Partial<Record<keyof DisplaySettings, unknown>> = settings;
  const defaults = displayDefaultsFor(host);
  return {
    windowMode: pick(record.windowMode, defaults.windowMode, isWindowMode),
    displayMonitor: pick(record.displayMonitor, defaults.displayMonitor, isString),
    syncedRateInFullscreen: pick(record.syncedRateInFullscreen, defaults.syncedRateInFullscreen, isBoolean),
    syncedRateTargetHz: pick(record.syncedRateTargetHz, defaults.syncedRateTargetHz, isRate),
  };
};

export { readDisplaySettings };
