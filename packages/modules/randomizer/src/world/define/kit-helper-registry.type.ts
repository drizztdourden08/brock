/* @layer core @kind types */
import type { HelperRegistry, World, WorldKeys } from '../types';

type KitHelperRegistry<K extends WorldKeys> = HelperRegistry<World<K>>;

export type { KitHelperRegistry };
