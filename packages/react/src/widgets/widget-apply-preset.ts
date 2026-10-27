/* @layer renderer-shell @kind logic */
import { kitRoute } from './kits/kit-route';
import { presetLayout } from './preset-layout';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { presetNames } from './widget-preset-names';
import { DEFAULT_PRESET, NAMED_PRESETS } from './widget-presets.constants';

const applyPreset = (name: string): void => {
  const store = useWidgetLayoutStore.getState();
  if (name === DEFAULT_PRESET && store.preset) {
    store.reset();
    return;
  }
  const preset = NAMED_PRESETS.get(name);
  if (!preset) throw new Error(`Unknown layout preset "${name}". Known presets: ${presetNames().join(', ') || 'none'}.`);
  kitRoute.leave();
  store.setLayout(presetLayout(preset, store.definitions));
};

export { applyPreset };
