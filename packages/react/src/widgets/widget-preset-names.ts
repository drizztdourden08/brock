/* @layer renderer-shell @kind logic */
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { DEFAULT_PRESET, NAMED_PRESETS } from './widget-presets.constants';

const presetNames = (): string[] => [...(useWidgetLayoutStore.getState().preset ? [DEFAULT_PRESET] : []), ...NAMED_PRESETS.keys()];

export { presetNames };
