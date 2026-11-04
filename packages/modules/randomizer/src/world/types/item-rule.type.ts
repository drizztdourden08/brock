/* @layer core @kind types */
import type { WorldKeys } from './world-keys.type';

type ItemRule<K extends WorldKeys = WorldKeys> = { check(item: K['item']): boolean }['check'];

export type { ItemRule };
