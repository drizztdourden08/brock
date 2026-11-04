/* @layer core @kind types */
import type { FillBuild, World, WorldKeys } from '../types';

interface DefPool<K extends WorldKeys = WorldKeys> {
  progression: K['item'][];
  rest: K['item'][];
  eligible?: FillBuild<World<K>>['eligible'];
  relaxWhenBeatable?: boolean;
}

export type { DefPool };
