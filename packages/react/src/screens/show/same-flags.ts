/* @layer renderer-shell @kind logic */
import type { ShowFlagValues } from './show.type';

const sameFlags = (a: ShowFlagValues | undefined, b: ShowFlagValues): boolean => {
  if (a === undefined) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => Object.is(a[key], b[key]));
};

export { sameFlags };
