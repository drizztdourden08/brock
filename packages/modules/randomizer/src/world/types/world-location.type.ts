/* @layer core @kind types */
import type { WorldKeys } from './world-keys.type';

interface WorldLocation<K extends WorldKeys = WorldKeys> {
  key: K['location'];
  region: K['region'];
  vanillaItem?: K['item'];
  tags?: Readonly<Record<string, unknown>>;
}

export type { WorldLocation };
