/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { settingEntries } from '../src/search/catalog/setting-entries';
import type { CatalogInput } from '../src/search/search.type';
import { resolveSections } from '../src/settings/SettingsLayout/behavior/resolve-sections';
import { itemShown } from '../src/settings/item-shown';
import type { Section, SettingItem, TabDef } from '../src/settings/settings.type';

const SPLIT: SettingItem = { key: 'guideColorSplit', label: 'Split guide colour', noDescription: true };
const GUIDE_Y: SettingItem = { key: 'guideColorY', label: 'Guide colour Y', noDescription: true, visibleWhen: { key: 'guideColorSplit', equals: true } };
const PLAIN: SettingItem = { key: 'guideColor', label: 'Guide colour', noDescription: true, visibleWhen: { key: 'guideColorSplit', notEquals: true } };
const NESTED: SettingItem = { key: 'a', label: 'Nested', noDescription: true, visibleWhen: { key: 'guide.mode', equals: 'split' } };
const BOTH: SettingItem = { key: 'b', label: 'Both', noDescription: true, visible: () => false, visibleWhen: { key: 'guideColorSplit', equals: true } };

const sections: Section[] = [{ id: 'guides', title: 'Guides', items: [SPLIT, GUIDE_Y, PLAIN] }];

const keysOf = (settings: object, query = ''): string[] =>
  resolveSections(sections, query, settings).flatMap((section) => section.groups).flatMap((group) => group.items).map((item) => item.key);

describe('K1 a row shown by another setting', { tags: ['critical'] }, () => {
  it('shows the row only while the other setting equals the value, and the opposite rule flips', () => {
    expect(keysOf({ guideColorSplit: false })).toEqual(['guideColorSplit', 'guideColor']);
    expect(keysOf({ guideColorSplit: true })).toEqual(['guideColorSplit', 'guideColorY']);
    expect(keysOf({})).toEqual(['guideColorSplit', 'guideColor']);
  });

  it('skips the hidden row in the page search and in the search index', () => {
    expect(keysOf({ guideColorSplit: false }, 'guide colour y')).toEqual([]);
    expect(keysOf({ guideColorSplit: true }, 'guide colour y')).toEqual(['guideColorY']);
    const tab: TabDef<object> = { id: 'guides', label: 'Guides', navIcon: null, group: 'app', sections: () => sections };
    const entryIds = (settings: object): string[] => {
      const input = { settings, tabs: [tab], settingsPlace: { bucket: null, title: 'Settings' }, isMobile: false, hasProfile: true, patch: vi.fn() } as Partial<CatalogInput> as CatalogInput;
      return settingEntries(input).map((entry) => entry.id);
    };
    expect(entryIds({ guideColorSplit: false })).toEqual(['setting:guideColorSplit', 'setting:guideColor']);
    expect(entryIds({ guideColorSplit: true })).toEqual(['setting:guideColorSplit', 'setting:guideColorY']);
  });

  it('reads a dotted key and a flat source key, and needs the predicate to agree as well', () => {
    expect(itemShown(NESTED, { guide: { mode: 'split' } })).toBe(true);
    expect(itemShown(NESTED, { guide: { mode: 'one' } })).toBe(false);
    expect(itemShown(NESTED, { 'guide.mode': 'split' })).toBe(true);
    expect(itemShown(BOTH, { guideColorSplit: true })).toBe(false);
  });
});
