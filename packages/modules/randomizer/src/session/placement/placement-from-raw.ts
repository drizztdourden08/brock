/* @layer core @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { isRecord } from './is-record';
import { stampAccepted } from './stamp-accepted';

const placementFromRaw = <P, A>(game: RandomizerGame<P, A>, raw: unknown): P | null => {
  if (!isRecord(raw)) return null;
  const guard = game.isPlacement;
  const { stamp, ...body } = raw;
  if (stamp === undefined) return guard?.(raw) ? raw : null;
  if (!stampAccepted(game, stamp)) return null;
  if (guard === undefined) return body as P;
  return guard(body) ? body : null;
};

export { placementFromRaw };
