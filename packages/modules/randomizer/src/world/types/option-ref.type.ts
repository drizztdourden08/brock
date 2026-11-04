/* @layer core @kind types */
import type { WorldKeys } from './world-keys.type';

interface OptionRef<K extends WorldKeys = WorldKeys> {
  option: K['option'];
}

export type { OptionRef };
