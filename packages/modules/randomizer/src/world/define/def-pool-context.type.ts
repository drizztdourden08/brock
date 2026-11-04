/* @layer core @kind types */
import type { Rng } from '../rng';
import type { World, WorldKeys } from '../types';

interface DefPoolContext<K extends WorldKeys = WorldKeys> {
  request: { seed: string };
  rng: Rng;
  world: World<K>;
}

export type { DefPoolContext };
