/* @layer core @kind logic */
import type { RollJoined } from './roll-outcome.type';

const joinedRoll = (result: unknown): RollJoined => ({ kind: 'joined', result });

export { joinedRoll };
