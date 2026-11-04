/* @layer core @kind types */
import type { WorldKeys } from './world-keys.type';

type ItemRule<K extends WorldKeys = WorldKeys> = (item: K['item']) => boolean;

export type { ItemRule };
