/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { defaultOptionTabs } from '../src/renderer/options/behavior/default-option-tabs';
import { tagFor } from '../src/renderer/options/behavior/tag-for';
import { orderedTiles } from '../src/renderer/options/SpriteTileSet/behavior/ordered-tiles';
import type { OptionDef } from '../src/world/options/option-def.type';

const option = (extra: Partial<OptionDef>): OptionDef => ({ key: 'a', label: 'A', default: false, ...extra });

describe('tagFor', { tags: ['critical'] }, () => {
  it('tags nothing that can change', () => {
    expect(tagFor(option({}))).toBeNull();
  });

  it('names why a frozen option is fixed', () => {
    expect(tagFor(option({ frozen: true }))).toBe('fixed');
    expect(tagFor(option({ frozen: true, implementation: 'not-implemented' }))).toBe('not in this version');
    expect(tagFor(option({ frozen: true, implementation: 'not-applicable' }))).toBe('not used here');
  });
});

describe('defaultOptionTabs', { tags: ['critical'] }, () => {
  it('moves not-implemented options to a last Upcoming tab', () => {
    const tabs = defaultOptionTabs([option({ key: 'a' }), option({ key: 'b', implementation: 'not-implemented' })]);
    expect(tabs.map((tab) => tab.id)).toEqual(['general', 'upcoming']);
    expect(tabs[1]?.keys).toEqual(['b']);
  });
});

describe('orderedTiles', { tags: ['critical'] }, () => {
  const items = ['x', 'y', 'z'].map((id) => ({ id, name: id, checked: false }));

  it('keeps the given order without an order list', () => {
    expect(orderedTiles(items).map((item) => item.id)).toEqual(['x', 'y', 'z']);
  });

  it('follows the order list and puts unknown ids last', () => {
    expect(orderedTiles(items, ['z', 'x']).map((item) => item.id)).toEqual(['z', 'x', 'y']);
  });
});
