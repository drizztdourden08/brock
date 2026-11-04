/* @layer core @kind types */
import type { WorldKeys } from './world-keys.type';

interface Exit<K extends WorldKeys = WorldKeys> {
  name: string;
  source: K['region'];
  target: K['region'];
}

export type { Exit };
