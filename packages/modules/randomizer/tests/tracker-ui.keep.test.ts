/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { randomSeed } from '../src';
import { admitToasts } from '../src/renderer/views/CheckToasts/behavior/admit-toasts';
import { newCompletedKeys } from '../src/renderer/views/CheckToasts/behavior/new-completed-keys';
import { MAX_BURST, MAX_VISIBLE } from '../src/renderer/views/CheckToasts/CheckToasts.constants';
import type { CheckToastEntry } from '../src/renderer/views/CheckToasts/CheckToasts.type';
import { sourceLabel } from '../src/renderer/views/DeliveryQueueIndicator/behavior/source-label';
import { sourceTone } from '../src/renderer/views/DeliveryQueueIndicator/behavior/source-tone';
import { visibleLinesOf } from '../src/renderer/views/DeliveryQueueIndicator/behavior/visible-lines-of';
import type { CheckRow } from '../src/renderer/views/ChecksView/behavior/check-row.type';
import { scopedOptionsOf } from '../src/renderer/profile-tab/ProfileRandomizerTab/behavior/scoped-options-of';
import type { DeliveryLine } from '../src/session/delivery/delivery-feed.type';
import type { OptionCatalog } from '../src/world/options/option-catalog.type';

const rowOf = (key: string): CheckRow => ({
  key, label: key, item: null, itemLabel: null, art: null, status: 'checked', marked: false,
  kind: 'item', facets: [], badges: [], group: '', order: 0,
});

const lineOf = (id: string): DeliveryLine => ({ id, message: id, source: 'network:peer' });

let serial = 0;
const nextId = (): string => `t${serial++}`;

describe('randomizer tracker ui', { tags: ['critical'] }, () => {
  it('makes a seed of 16 hex characters', () => {
    expect(randomSeed()).toMatch(/^[0-9a-f]{16}$/);
    expect(randomSeed()).not.toBe(randomSeed());
  });

  it('lists only the keys a completed set gained', () => {
    expect(newCompletedKeys(new Set(['a']), new Set(['a', 'b', 'c']))).toEqual(['b', 'c']);
    expect(newCompletedKeys(new Set(['a']), new Set(['a']))).toEqual([]);
  });

  it('keeps the latest toasts and drops a burst that is too large', () => {
    const rows = Array.from({ length: MAX_VISIBLE + 1 }, (_, index) => rowOf(`r${index}`));
    const first = admitToasts([], rows, nextId);
    expect(first).toHaveLength(MAX_VISIBLE);
    expect(first.at(-1)?.row.key).toBe(`r${MAX_VISIBLE}`);
    const burst = Array.from({ length: MAX_BURST + 1 }, (_, index) => rowOf(`b${index}`));
    const kept: readonly CheckToastEntry[] = first;
    expect(admitToasts(kept, burst, nextId)).toBe(kept);
    expect(admitToasts(kept, [], nextId)).toBe(kept);
  });

  it('shows the source tag, tone and overflow of the queue', () => {
    expect(sourceLabel('network:peer one')).toBe('peer one');
    expect(sourceLabel('system')).toBe('system');
    expect(sourceTone('Cheat:x')).toBe('warning');
    expect(sourceTone('mystery')).toBe('secondary');
    const pending = [lineOf('a'), lineOf('b'), lineOf('c')];
    expect(visibleLinesOf({ pending, delivering: null }, 2)).toEqual({ shown: pending.slice(0, 2), overflow: 1 });
    expect(visibleLinesOf({ pending, delivering: lineOf('d') }, 2).shown).toHaveLength(1);
  });

  it('scopes options to the ones that differ from the default', () => {
    const catalog: OptionCatalog = [
      { key: 'a', label: 'A', default: false },
      { key: 'b', label: 'B', default: 1 },
      { key: 'c', label: 'C', default: 'x', frozen: true },
    ];
    const values = { a: true, b: 1, c: 'y' };
    expect(scopedOptionsOf(catalog, values, 'changed').map((option) => option.key)).toEqual(['a']);
    expect(scopedOptionsOf(catalog, values, 'all').map((option) => option.key)).toEqual(['a', 'b']);
  });
});
