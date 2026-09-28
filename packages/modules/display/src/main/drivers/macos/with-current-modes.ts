/* @layer electron-main @kind logic */
import { asNumber } from '../koffi/as-number';
import { macBindings } from './mac-bindings';
import type { MacBindings, ModeSet } from './macos.type';

const releaseRef = (api: MacBindings, ref: unknown): boolean => {
  if (!ref) return false;
  try {
    api.release(ref);
    return true;
  } catch {
    return false;
  }
};

const modesAtResolution = (api: MacBindings, list: unknown, current: unknown): unknown[] => {
  const width = asNumber(api.width(current));
  const height = asNumber(api.height(current));
  const total = asNumber(api.count(list));
  const modes: unknown[] = [];
  for (let i = 0; i < total; i++) {
    const mode = api.valueAt(list, i);
    if (asNumber(api.width(mode)) === width && asNumber(api.height(mode)) === height) modes.push(mode);
  }
  return modes;
};

const withCurrentModes = <T>(run: (set: ModeSet) => T, fallback: T): T => {
  const { api } = macBindings();
  if (!api) return fallback;
  let list: unknown = null;
  let current: unknown = null;
  try {
    const display = api.mainDisplayId();
    list = api.copyAllModes(display, null);
    current = api.copyCurrentMode(display);
    if (!list || !current) return fallback;
    return run({ api, modes: modesAtResolution(api, list, current), current });
  } catch {
    return fallback;
  } finally {
    releaseRef(api, list);
    releaseRef(api, current);
  }
};

export { withCurrentModes };
