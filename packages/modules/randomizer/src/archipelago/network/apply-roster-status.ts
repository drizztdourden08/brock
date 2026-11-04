/* @layer core @kind logic */
import type { RosterDeps } from './roster.type';
import { slotOfStatusKey } from './slot-of-status-key';

const applyRosterStatus = (deps: RosterDeps, key: string, value: unknown, seed: boolean): boolean => {
  const { facts, presence, isLinked } = deps;
  const slot = slotOfStatusKey(key, facts.team ?? 0);
  if (slot === null) return false;
  const presenceIsOwnConnection = slot === facts.slot;
  presence.setStatus(slot, value, seed && !presenceIsOwnConnection && !isLinked(slot));
  return true;
};

export { applyRosterStatus };
