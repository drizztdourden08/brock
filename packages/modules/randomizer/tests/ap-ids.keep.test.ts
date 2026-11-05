/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { compareApKeys, createApIdLookup } from '../src/archipelago/ap-ids';

const lookup = createApIdLookup({ t1: 10, t2: 11 }, { key: 100, boat: 101 });

describe('createApIdLookup', { tags: ['critical'] }, () => {
  it('round trips locations and items', () => {
    expect(lookup.locationKeyOf(lookup.locationIdOf('t2'))).toBe('t2');
    expect(lookup.itemKeyOf(lookup.itemIdOf('boat'))).toBe('boat');
    expect(lookup.itemIdOf('key')).toBe(100);
  });

  it('answers undefined for an unknown id', () => {
    expect(lookup.locationKeyOf(999)).toBeUndefined();
    expect(lookup.itemKeyOf(999)).toBeUndefined();
  });

  it('throws the word for word text on an unknown key', () => {
    const missing = 'nope' as 't1';
    expect(() => lookup.locationIdOf(missing)).toThrow('no Archipelago location id for: nope');
    expect(() => lookup.itemIdOf('nope' as 'key')).toThrow('no Archipelago item id for: nope');
  });
});

describe('compareApKeys', { tags: ['critical'] }, () => {
  it('orders digits as numbers', () => {
    expect(['k10', 'k2', 'k1'].sort(compareApKeys)).toEqual(['k1', 'k2', 'k10']);
  });
});
