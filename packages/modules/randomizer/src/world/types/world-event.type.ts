/* @layer core @kind types */
import type { WorldKeys } from './world-keys.type';

interface WorldEvent<K extends WorldKeys = WorldKeys> {
  key: K['event'];
  region: K['region'];
}

export type { WorldEvent };
