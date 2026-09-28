/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createFeatureResolver } from '../src/settings/features/resolver';
import type { BaseFeatureDef } from '../src/settings/features/feature.type';

type Def = BaseFeatureDef & { locked?: boolean };

const defs: Def[] = [
  { id: 'a', label: 'A', description: '', group: 'g', default: true, requires: [], live: true },
  { id: 'b', label: 'B', description: '', group: 'g', default: false, requires: ['a'], live: true },
  { id: 'c', label: 'C', description: '', group: 'g', default: false, requires: ['b'], suggests: ['a'], live: false, locked: true },
];

describe('createFeatureResolver', () => {
  const resolver = createFeatureResolver(defs);

  it('prunes a feature whose requirement is off, to a fixpoint', () => {
    const result = resolver.resolve(['b', 'c']);
    expect([...result.effective]).toEqual([]);
    expect(result.autoDisabled.map((d) => d.id)).toEqual(['b', 'c']);
  });

  it('keeps a consistent set and unknown ids', () => {
    const result = resolver.resolve(['a', 'b', 'zzz']);
    expect([...result.effective].sort()).toEqual(['a', 'b', 'zzz']);
    expect(result.autoDisabled).toEqual([]);
  });

  it('lists the transitive requirements not yet enabled', () => {
    expect(resolver.requirementClosure('c', new Set(['a'])).map((d) => d.id)).toEqual(['b']);
  });

  it('strips locked ids before resolving so dependents die too', () => {
    const result = resolver.resolveGates(['a', 'b', 'c'], (def) => def.locked === true);
    expect([...result.effective].sort()).toEqual(['a', 'b']);
  });
});
