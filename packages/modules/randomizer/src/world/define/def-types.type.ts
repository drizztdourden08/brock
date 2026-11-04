/* @layer core @kind types */
import type { FillBuild, World, WorldKeys } from '../types';
import type { DefPlacement } from './def-placement.type';

interface DefTypes<K extends WorldKeys = WorldKeys> {
  world: World<K>;
  request: { seed: string };
  prep: undefined;
  build: FillBuild<World<K>>;
  placement: DefPlacement<K>;
}

export type { DefTypes };
