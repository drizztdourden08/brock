/* @layer core @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { isRecord } from './is-record';

const stampAccepted = <P, A>(game: RandomizerGame<P, A>, stamp: unknown): boolean => {
  if (!isRecord(stamp) || stamp.game !== game.world.game) return false;
  const { current, legacy = [] } = game.placementSchemas;
  const schema = stamp.placementSchema;
  return typeof schema === 'string' && [current, ...legacy].includes(schema);
};

export { stampAccepted };
