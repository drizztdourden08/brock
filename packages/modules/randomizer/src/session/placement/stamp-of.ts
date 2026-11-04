/* @layer core @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { PlacementStamp } from './placement-stamp.type';

const stampOf = <P, A>(game: RandomizerGame<P, A>): PlacementStamp => ({
  game: game.world.game,
  worldSchema: game.world.worldSchema,
  placementSchema: game.placementSchemas.current,
});

export { stampOf };
