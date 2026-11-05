/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { readTracker, trackerFromDef } from '../src/tracker';
import type { TrackerKind } from '../src/tracker';
import { countRows } from '../src/renderer/views/ChecksView/behavior/count-rows';
import { filterRows } from '../src/renderer/views/ChecksView/behavior/filter-rows';
import { groupRows } from '../src/renderer/views/ChecksView/behavior/group-rows';
import { rowsOf } from '../src/renderer/views/ChecksView/behavior/rows-of';
import type { RowFilter } from '../src/renderer/views/ChecksView/behavior/check-row.type';
import type { DefPlacement } from '../src/world';
import { toyVanillaDef } from './toy-world.fixture';

const EVENTS = new Set(['l1', 'l2']);

const provider = trackerFromDef(toyVanillaDef(), {
  labelOf: (key) => `Spot ${key}`,
  facets: [{ id: 'terrain', label: 'Terrain', options: [{ id: 'town', label: 'Town' }, { id: 'wild', label: 'Wild' }] }],
  facetsOf: (key) => (key.startsWith('t') ? ['town'] : ['wild']),
  kindOf: (key): TrackerKind => (EVENTS.has(key) ? 'event' : 'item'),
  badgesOf: (key) => (key === 't1' ? [{ id: 'now', label: 'now', tone: 'success' }] : []),
  artOf: (key) => (key === 't1' ? 'art/t1.png' : null),
});

const placement = (): DefPlacement => {
  const vanilla = provider.vanilla?.();
  if (vanilla === undefined) throw new Error('no vanilla placement');
  return vanilla;
};

const build = (checked: string[], grouping: string) => {
  const feed = { placement: placement(), checked: new Set(checked), completed: new Set(checked), held: [] };
  const reading = readTracker(provider, { ...feed, assumed: new Set<string>() });
  return rowsOf({ provider, reading, feed, marks: new Set(['f1']), grouping });
};

const open: RowFilter = { status: 'all', kind: 'all', facets: [], facetMode: 'any', search: '' };

describe('checks tracker model', { tags: ['critical'] }, () => {
  it('builds one row per location with the hook values', () => {
    const rows = build([], 'region');
    expect(rows.map((row) => row.key).sort()).toEqual(['f1', 'l1', 'l2', 't1', 't2']);
    const first = rows.find((row) => row.key === 't1');
    expect(first?.label).toBe('Spot t1');
    expect(first?.art).toBe('art/t1.png');
    expect(first?.badges).toHaveLength(1);
    expect(rows.find((row) => row.key === 'f1')?.marked).toBe(true);
    expect(rows.find((row) => row.key === 'l1')?.kind).toBe('event');
  });

  it('groups rows by region name', () => {
    const tree = groupRows(build([], 'region'));
    const sizes = Object.fromEntries(tree.children.map((child) => [child.label, child.items.length]));
    expect(sizes).toEqual({ Town: 2, Forest: 1, Lake: 2 });
  });

  it('filters by facet in the any mode and the all mode', () => {
    const rows = build([], 'region');
    expect(filterRows(rows, { ...open, facets: ['town'] }).map((row) => row.key).sort()).toEqual(['t1', 't2']);
    expect(filterRows(rows, { ...open, facets: ['town', 'wild'], facetMode: 'any' })).toHaveLength(5);
    expect(filterRows(rows, { ...open, facets: ['town', 'wild'], facetMode: 'all' })).toHaveLength(0);
  });

  it('filters by kind, status and search', () => {
    const rows = build(['t1'], 'region');
    expect(filterRows(rows, { ...open, kind: 'event' }).map((row) => row.key).sort()).toEqual(['l1', 'l2']);
    expect(filterRows(rows, { ...open, status: 'checked' }).map((row) => row.key)).toEqual(['t1']);
    expect(filterRows(rows, { ...open, search: 'spot l' })).toHaveLength(2);
  });

  it('counts rows by status', () => {
    const counts = countRows(build(['t1'], 'region'));
    expect(counts.total).toBe(5);
    expect(counts.checked).toBe(1);
    expect(counts.checked + counts.available + counts.blocked).toBe(5);
  });
});
