/* @layer renderer-shell @kind constants */
import type { LayoutPreset } from './layout-preset.type';

const DEFAULT_PRESET = 'default';
const NAMED_PRESETS = new Map<string, LayoutPreset>();

export { DEFAULT_PRESET, NAMED_PRESETS };
