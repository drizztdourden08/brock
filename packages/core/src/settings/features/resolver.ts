/* @layer core @kind logic */
import type { BaseFeatureDef, ResolveResult } from './feature.type';
import type { FeatureResolver } from './resolver.type';

const createFeatureResolver = <T extends BaseFeatureDef>(defs: readonly T[]): FeatureResolver<T> => {
  const byId: Record<string, T> = {};
  for (const def of defs) byId[def.id] = def;

  const resolve = (enabled: Iterable<string>): ResolveResult => {
    const effective = new Set(enabled);
    const autoDisabled: { id: string; missing: string[] }[] = [];
    let changed = true;
    while (changed) {
      changed = false;
      for (const id of [...effective]) {
        const def = byId[id];
        if (!def) continue;
        const missing = def.requires.filter((r) => !effective.has(r));
        if (missing.length > 0) {
          effective.delete(id);
          autoDisabled.push({ id, missing });
          changed = true;
        }
      }
    }
    return { effective, autoDisabled };
  };

  const requirementClosure = (id: string, enabled: ReadonlySet<string>): T[] => {
    const out: T[] = [];
    const seen = new Set<string>([id]);
    const visit = (cur: string): void => {
      for (const r of byId[cur]?.requires ?? []) {
        if (seen.has(r)) continue;
        seen.add(r);
        const def = byId[r];
        if (def && !enabled.has(r)) out.push(def);
        visit(r);
      }
    };
    visit(id);
    return out;
  };

  const suggestionsFor = (id: string, enabled: ReadonlySet<string>): T[] =>
    (byId[id]?.suggests ?? [])
      .map((s) => byId[s])
      .filter((d): d is T => d !== undefined && !enabled.has(d.id));

  const resolveGates = (requested: Iterable<string>, isLocked: (def: T) => boolean): ResolveResult => {
    const seed = [...requested].filter((id) => {
      const def = byId[id];
      return !def || !isLocked(def);
    });
    return resolve(seed);
  };

  return { byId, resolve, requirementClosure, suggestionsFor, resolveGates };
};

export { createFeatureResolver };
