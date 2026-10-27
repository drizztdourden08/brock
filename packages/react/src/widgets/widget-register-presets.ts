/* @layer renderer-shell @kind logic */
import type { LayoutPreset } from './layout-preset.type';
import { DEFAULT_PRESET, NAMED_PRESETS } from './widget-presets.constants';

const registerPresets = (presets: Readonly<Record<string, LayoutPreset>>): (() => void) => {
  const names = Object.keys(presets);
  if (names.includes(DEFAULT_PRESET)) throw new Error(`"${DEFAULT_PRESET}" is the app's own layout preset and cannot be registered again.`);
  for (const name of names) {
    const preset = presets[name];
    if (preset) NAMED_PRESETS.set(name, preset);
  }
  return () => {
    for (const name of names) if (NAMED_PRESETS.get(name) === presets[name]) NAMED_PRESETS.delete(name);
  };
};

export { registerPresets };
