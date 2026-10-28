/* @layer renderer-shell @kind logic */
import { activeHolds } from './active-holds';
import type { HoldCause } from './command.type';

const releaseHold = (id: string, cause: HoldCause): void => {
  const entry = activeHolds.get(id);
  if (entry === undefined) return;
  activeHolds.delete(id);
  const { hold } = entry.def;
  if (hold === undefined) return;
  const heldMs = Date.now() - entry.since;
  const tap = cause === 'keyup' && hold.tapMs !== undefined && heldMs < hold.tapMs;
  hold.release({ ...entry.context, heldMs, tap, cause });
};

export { releaseHold };
