/* @layer core @kind types */
import type { Rng } from '../rng/rng.type';
import type { FillBuild } from './fill-build.type';

interface FillPhase<B extends FillBuild = FillBuild> {
  id: string;
  run(build: B, rng: Rng): void;
}

export type { FillPhase };
