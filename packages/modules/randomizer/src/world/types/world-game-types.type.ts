/* @layer core @kind types */
import type { FillBuild } from './fill-build.type';
import type { World } from './world.type';

interface WorldGameTypes {
  world: World;
  request: { seed: string };
  prep: unknown;
  build: FillBuild;
  placement: unknown;
}

export type { WorldGameTypes };
