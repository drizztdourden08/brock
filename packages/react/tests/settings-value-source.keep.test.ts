/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { settingsTab } from '../src/screens/conventions/settings-tab';
import { buildCatalog } from '../src/search/catalog/build-catalog';
import type { CatalogInput } from '../src/search/search.type';
import { matchTabs } from '../src/settings/SettingsHub/behavior/match-tabs';
import { resolveSections } from '../src/settings/SettingsLayout/behavior/resolve-sections';
import { settingRow } from '../src/settings/SettingsLayout/behavior/setting-row';
import { sourcePatch } from '../src/settings/SettingsLayout/behavior/source-patch';
import { sourceValues } from '../src/settings/source-values';
import { tabSections } from '../src/settings/tab-sections';
import type { Section, SettingItem, SettingsValueSource, TabDef } from '../src/settings/settings.type';

type MemorySource = SettingsValueSource & { store: Record<string, unknown> };

const memorySource = (initial: Record<string, unknown>): MemorySource => {
  const store = { ...initial };
  return { store, get: (key) => store[key], set: (key, value) => { store[key] = value; } };
};

const AUTO_START: SettingItem = { key: 'autoStart', label: 'Start with the system', description: 'Launch at login.', hint: 'Applies at the next login.', keywords: 'login boot' };
const PROXY: SettingItem = {
  key: 'proxy', label: 'Proxy address', description: 'Where requests go.', hint: 'Leave empty for none.', control: { kind: 'text' }, visible: (values) => values.autoStart === true,
};
const ITEMS: SettingItem[] = [AUTO_START, PROXY];

const tabOf = (sections: Section[], source?: SettingsValueSource): TabDef<object> => ({
  id: 'app', label: 'App', navIcon: null, group: 'General', sections: () => sections, ...(source ? { source } : {}),
});

const keysOf = (sections: Section[], profile: object): string[] =>
  resolveSections(sections, '', profile).flatMap((section) => section.groups.flatMap((group) => group.items.map((item) => item.key)));

describe('reading a settings value source', () => {
  it('reads the keys of a section from its source and nothing from the profile', () => {
    const source = memorySource({ autoStart: true, proxy: 'p:1', other: 'x' });
    expect(sourceValues({ id: 'a', title: 'A', items: ITEMS, source })).toEqual({ autoStart: true, proxy: 'p:1' });
    expect(sourceValues({ id: 'a', title: 'A', items: ITEMS })).toBeUndefined();
  });

  it('gives a page source to the sections that name none, and keeps a section source over it', () => {
    const page = memorySource({});
    const own = memorySource({});
    const tab = tabOf([{ id: 'a', title: 'A', items: ITEMS }, { id: 'b', title: 'B', items: ITEMS, source: own }], page);
    const [first, second] = tabSections(tab, {});
    expect(first?.source).toBe(page);
    expect(second?.source).toBe(own);
    expect(tabSections(tabOf([{ id: 'a', title: 'A', items: ITEMS }]), {})[0]?.source).toBeUndefined();
  });

  it('shows a row by the values of its source, not of the profile', () => {
    const source = memorySource({ autoStart: false });
    const sections: Section[] = [{ id: 'a', title: 'A', items: ITEMS, source }];
    expect(keysOf(sections, { autoStart: true })).toEqual(['autoStart']);
    source.store.autoStart = true;
    expect(keysOf(sections, { autoStart: false })).toEqual(['autoStart', 'proxy']);
  });

  it('puts the meta source of a .settings.ts page on its tab', () => {
    const source = memorySource({});
    expect(settingsTab({ kind: 'settings', bucket: 'game', id: 'app', sections: [], meta: { source } }).source).toBe(source);
    expect('source' in settingsTab({ kind: 'settings', bucket: 'game', id: 'app', sections: [] })).toBe(false);
  });
});

describe('writing a settings value source', () => {
  it('writes a row change to the source key by key, then refreshes', async () => {
    const source = memorySource({ autoStart: false });
    const refresh = vi.fn();
    const row = settingRow(AUTO_START, { settings: { autoStart: false }, onChange: sourcePatch(source, refresh), disabled: false, lock: null });
    if (row && 'input' in row && row.input?.kind === 'toggle') row.input.onChange(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(source.store.autoStart).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('waits for an async set before it refreshes', async () => {
    let finish = (): void => undefined;
    const source: SettingsValueSource = { get: () => undefined, set: () => new Promise<void>((resolve) => { finish = resolve; }) };
    const refresh = vi.fn();
    sourcePatch(source, refresh)({ a: 1 });
    expect(refresh).not.toHaveBeenCalled();
    finish();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});

describe('finding the rows of a settings value source', () => {
  it('keeps the source on the resolved section, and finds a row by its keywords', () => {
    const source = memorySource({});
    const found = resolveSections([{ id: 'a', title: 'A', items: ITEMS, source }], 'login');
    expect(found.map((section) => section.id)).toEqual(['a']);
    expect(found[0]?.source).toBe(source);
  });

  it('counts hub search matches by the values of the source', () => {
    const source = memorySource({});
    const tab = tabOf([{ id: 'a', title: 'A', items: ITEMS }], source);
    expect(matchTabs([tab], {}, 'proxy').total).toBe(0);
    source.store.autoStart = true;
    expect(matchTabs([tab], {}, 'proxy').total).toBe(1);
  });

  it('lists the rows in the palette with a toggle that flips the source', () => {
    const source = memorySource({ autoStart: false });
    const patch = vi.fn();
    const input: CatalogInput = {
      index: [], live: [], menu: [], widgets: [], screens: [], home: '', tabs: [tabOf([{ id: 'a', title: 'A', items: ITEMS }], source)],
      settingsPlace: { bucket: null, title: 'Settings' }, settings: { autoStart: 'profile' }, patch, actions: [], isDev: false, isMobile: false, hasProfile: true,
    };
    const entries = buildCatalog(input).filter((entry) => entry.kind === 'setting');
    expect(entries.map((entry) => entry.id)).toEqual(['setting:autoStart']);
    entries[0]?.toggle?.flip();
    expect(source.store.autoStart).toBe(true);
    expect(patch).not.toHaveBeenCalled();
  });
});
