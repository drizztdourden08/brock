/* @layer core @kind logic */
import type { RollJoined } from './roll-outcome.type';

const isJoinedRoll = (raw: unknown): raw is RollJoined =>
  typeof raw === 'object' && raw !== null && (raw as Partial<RollJoined>).kind === 'joined' && 'result' in raw;

export { isJoinedRoll };
