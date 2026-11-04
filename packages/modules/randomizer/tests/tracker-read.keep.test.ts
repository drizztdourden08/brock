/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { checkedLocations, countStatuses, isTrackerFile, readTracker, trackerFromDef } from '../src/tracker';
import type { DefPlacement } from '../src/world';
import { toyAssumptions, toyVanillaDef } from './toy-world.fixture';

const provider = trackerFromDef(toyVanillaDef(), {
  assumedHeld: (assumed) => (assumed.has('boat') ? ['boat'] : []),
  locationOf: (key) => (key === 'junk' ? null : key.replace('raw-', '')),
  assumptions: toyAssumptions,
});

const vanilla = (): DefPlacement => {
  const placement = provider.vanilla?.();
  if (placement === undefined) throw new Error('no vanilla placement');
  return placement;
};

const read = (checked: string[] = [], held: string[] = [], assumed: string[] = []) =>
  readTracker(provider, {
    placement: vanilla(), checked: new Set(checked), completed: new Set(checked), held, assumed: new Set(assumed),
  });

const keysWith = (status: string, statuses: ReadonlyMap<string, string>): string[] =>
  [...statuses].filter(([, value]) => value === status).map(([key]) => key);

describe('tracker read', { tags: ['critical'] }, () => {
  it('reads nothing held', () => {
    const { statuses } = read();
    expect(keysWith('available', statuses)).toEqual(['t1', 't2']);
    expect(keysWith('blocked', statuses)).toEqual(['f1', 'l1', 'l2']);
  });

  it('collects the item of a checked location', () => {
    const { statuses } = read(['t1']);
    expect(statuses.get('t1')).toBe('checked');
    expect(keysWith('available', statuses)).toEqual(['t2', 'f1']);
  });

  it('raises held items to a floor', () => {
    expect(keysWith('available', read([], ['key', 'key']).statuses)).toEqual(['t1', 't2', 'f1']);
    expect(keysWith('blocked', read([], ['key', 'boat']).statuses)).toEqual([]);
  });

  it('counts assumed items with the held ones', () => {
    expect(keysWith('blocked', read([], ['key'], ['boat']).statuses)).toEqual([]);
    expect(keysWith('blocked', read([], ['key']).statuses)).toEqual(['l1', 'l2']);
  });

  it('maps raw keys through locationOf', () => {
    const { world } = read();
    const checked = checkedLocations(provider, world, ['raw-t1', 'junk', 'raw-nowhere', 'f1']);
    expect([...checked]).toEqual(['t1', 'f1']);
  });

  it('places vanilla items in the spheres of a hand count', () => {
    const spheres = vanilla().spheres.map((sphere) => sphere.locations);
    expect(spheres).toEqual([['t1', 't2'], ['f1'], ['l1', 'l2']]);
    expect(provider.sphereOf?.(vanilla()).get('l2')).toBe(2);
  });

  it('keeps counts summing to the total', () => {
    const { counts, statuses } = read(['t1']);
    expect(counts).toEqual({ checked: 1, available: 2, blocked: 2, total: 5 });
    expect(counts.checked + counts.available + counts.blocked).toBe(counts.total);
    expect(countStatuses(statuses, (location) => location.startsWith('l')).total).toBe(2);
  });

  it('accepts only the marks file shape', () => {
    expect(isTrackerFile({ schema: 'tracker-v1', marks: ['t1'] })).toBe(true);
    expect(isTrackerFile({ schema: 'other', marks: [] })).toBe(false);
    expect(isTrackerFile({ schema: 'tracker-v1', marks: [1] })).toBe(false);
  });
});
