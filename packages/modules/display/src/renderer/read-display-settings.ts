/* @layer renderer-shell @kind logic */
import { DEFAULT_DISPLAY_SETTINGS } from '../display.constants';
import type { DisplaySettings, WindowMode } from '../display.type';

const isWindowMode = (value: unknown): value is WindowMode =>
  value === 'windowed' || value === 'borderless' || value === 'fullscreen';

const pick = <T>(value: unknown, fallback: T, valid: (candidate: unknown) => candidate is T): T =>
  valid(value) ? value : fallback;

const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isRate = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;

const readDisplaySettings = (settings: object): DisplaySettings => {
  const record: Partial<Record<keyof DisplaySettings, unknown>> = settings;
  const defaults = DEFAULT_DISPLAY_SETTINGS;
  return {
    windowMode: pick(record.windowMode, defaults.windowMode, isWindowMode),
    displayMonitor: pick(record.displayMonitor, defaults.displayMonitor, isString),
    syncedRateInFullscreen: pick(record.syncedRateInFullscreen, defaults.syncedRateInFullscreen, isBoolean),
    syncedRateTargetHz: pick(record.syncedRateTargetHz, defaults.syncedRateTargetHz, isRate),
  };
};

export { readDisplaySettings };
