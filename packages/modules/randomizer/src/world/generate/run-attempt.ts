/* @layer core @kind logic */
import { sweepPlacementSpheres } from '../fill/sweep-placement-spheres';
import { createRng } from '../rng';
import { attemptSeedOf } from './attempt-seed-of';
import type { RandomizerWorldGame, WorldGameTypes } from '../types';

const runAttempt = <T extends WorldGameTypes>(
  game: RandomizerWorldGame<T>, request: T['request'], prep: T['prep'], attempt: number,
): T['placement'] => {
  const rng = createRng(attemptSeedOf(request.seed, attempt));
  const build = game.build({ request, prep, rng, attempt });
  for (const phase of game.fillPhases) phase.run(build, rng);
  const sweep = sweepPlacementSpheres(build.world as T['world']);
  return game.finish({ build, sweep, prep, request, attempts: attempt + 1 });
};

export { runAttempt };
