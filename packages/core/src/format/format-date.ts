/* @layer core @kind logic */
import type { DatePreset } from './format-date.type';
import { PRESET_OPTS } from './format-date.constants';

const formatDate = (ts: number, preset: DatePreset = 'short', neverText = 'Never'): string => {
  if (!ts) return neverText;
  return new Date(ts).toLocaleDateString(undefined, PRESET_OPTS[preset]);
};

export { formatDate };
