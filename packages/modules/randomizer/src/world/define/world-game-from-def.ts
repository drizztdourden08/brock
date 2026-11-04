/* @layer core @kind logic */
import { createWorldFromDef } from './create-world-from-def';
import { defineWorldGame } from './define-world-game';
import { finishDefPlacement } from './finish-def-placement';
import { phasesWithMainFill } from './phases-with-main-fill';
import { unplacedLocations } from './unplaced-locations';
import type { RandomizerWorldGame, WorldKeys } from '../types';
import type { DefTypes } from './def-types.type';
import type { GameWorldDef } from './game-world-def.type';

const worldGameFromDef = <K extends WorldKeys>(def: GameWorldDef<K>): RandomizerWorldGame<DefTypes<K>> =>
  defineWorldGame<DefTypes<K>>({
    game: def.game,
    worldSchema: def.worldSchema,
    placementSchemas: def.placementSchemas,
    optionSchemas: def.optionSchemas,
    ...(def.maxAttempts === undefined ? {} : { maxAttempts: def.maxAttempts }),
    build: ({ request, rng }) => {
      const world = createWorldFromDef(def, request);
      const pool = def.buildPool({ request, rng, world });
      return {
        world,
        progression: pool.progression,
        rest: pool.rest,
        eligible: pool.eligible ?? (() => unplacedLocations(world)),
        relaxWhenBeatable: pool.relaxWhenBeatable ?? false,
      };
    },
    fillPhases: phasesWithMainFill(def.fillPhases),
    finish: ({ build, sweep, request, attempts }) =>
      finishDefPlacement(build.world, sweep, request.seed, attempts),
  });

export { worldGameFromDef };
