/* @layer core @kind logic */
import type { NamedSaveEntry, NamedSavePrune } from './save-slot.type';

const assertKeep = (keep: number | undefined): void => {
  if (keep !== undefined && (!Number.isInteger(keep) || keep < 0)) throw new Error(`Prune keep must be a whole number from 0, got ${keep}.`);
};

const prunedEntries = (entries: NamedSaveEntry[], { keep, maxAgeMs, now = Date.now() }: NamedSavePrune): NamedSaveEntry[] => {
  assertKeep(keep);
  const newestFirst = [...entries].sort((a, b) => b.savedAt - a.savedAt);
  return newestFirst.filter((entry, index) =>
    (keep !== undefined && index >= keep) || (maxAgeMs !== undefined && now - entry.savedAt > maxAgeMs));
};

export { prunedEntries };
