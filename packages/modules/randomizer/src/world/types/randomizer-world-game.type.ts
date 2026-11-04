/* @layer core @kind types */
import type { Rng } from '../rng/rng.type';
import type { FillPhase } from './fill-phase.type';
import type { PlacementSweep } from './placement-sweep.type';
import type { SchemaSet } from './schema-set.type';
import type { WorldGameTypes } from './world-game-types.type';

interface RandomizerWorldGame<T extends WorldGameTypes = WorldGameTypes> {
  game: string;
  worldSchema: string;
  placementSchemas: SchemaSet;
  optionSchemas: SchemaSet;
  maxAttempts?: number;
  prepare?: (request: T['request']) => T['prep'];
  build: (ctx: { request: T['request']; prep: T['prep']; rng: Rng; attempt: number }) => T['build'];
  fillPhases: readonly FillPhase<T['build']>[];
  finish: (done: {
    build: T['build'];
    sweep: PlacementSweep<T['world']>;
    prep: T['prep'];
    request: T['request'];
    attempts: number;
  }) => T['placement'];
}

export type { RandomizerWorldGame };
