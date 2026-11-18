/* @layer renderer-shell @kind logic */
import type { TesseraStringsOverride } from '@drizztdourden08/tessera/primitives';
import type { Groups } from './merge-string-groups.type';

const mergeStringGroups = (low: TesseraStringsOverride, high: TesseraStringsOverride | undefined): TesseraStringsOverride => {
  const a = low as Groups;
  const b = (high ?? {}) as Groups;
  const out: Groups = {};
  for (const group of new Set([...Object.keys(a), ...Object.keys(b)])) out[group] = { ...a[group], ...b[group] };
  return out;
};

export { mergeStringGroups };
