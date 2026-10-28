/* @layer renderer-shell @kind logic */
import type { HoldCause } from './command.type';
import { releaseHold } from './release-hold';

const releaseHolds = (ids: readonly string[], cause: HoldCause): void => {
  const failures: unknown[] = [];
  for (const id of ids) {
    try {
      releaseHold(id, cause);
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length > 0) throw failures[0];
};

export { releaseHolds };
