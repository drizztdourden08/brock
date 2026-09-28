/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { buildCatalog } from '../src/palette/catalog/build-catalog';
import type { CatalogInput, SearchEntry } from '../src/palette/palette.type';
import { rankEntries } from '../src/palette/rank-entries';
import type { ScreenDef } from '../src/screens/screen.type';
import type { TabDef } from '../src/settings/settings.type';

const entry = (id: string, label: string, extra: Partial<SearchEntry> = {}): SearchEntry => ({
  id, kind: 'action', label, breadcrumb: [], run: () => undefined, ...extra,
});

const screen = (id: string, extra: Partial<ScreenDef> = {}): ScreenDef => ({ id, title: id, render: () => null, ...extra });

const TABS: TabDef<object>[] = [{
  id: 'display',
  label: 'Display',
  navIcon: null,
  group: 'General',
  sections: () => [{ id: 'window', title: 'Window', items: [
    { key: 'fullscreen', label: 'Start fullscreen', description: 'Open the window fullscreen' },
    { key: 'scale', label: 'Scale', description: 'Pixel scale' },
  ] }],
}];

const input = (extra: Partial<CatalogInput> = {}): CatalogInput => ({
  menu: [],
  screens: [],
  home: 'home',
  tabs: TABS,
  settings: { fullscreen: true, scale: 2 },
  patch: () => undefined,
  actions: [],
  isDev: false,
  isMobile: false,
  hasProfile: true,
  ...extra,
});

describe('rankEntries', () => {
  it('returns nothing for a blank query', () => {
    expect(rankEntries([entry('a', 'Alpha')], '   ')).toEqual([]);
  });

  it('ranks an exact label above a prefix above a substring', () => {
    const ranked = rankEntries([entry('c', 'Absolom'), entry('b', 'Solo mode'), entry('a', 'Solo')], 'solo');
    expect(ranked.map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });

  it('needs every token to match somewhere', () => {
    const ranked = rankEntries([entry('a', 'Start fullscreen', { breadcrumb: ['Settings', 'Display'] }), entry('b', 'Start game')], 'display start');
    expect(ranked.map((e) => e.id)).toEqual(['a']);
  });

  it('boosts screens over settings on a tie', () => {
    const ranked = rankEntries([entry('s', 'Logs', { kind: 'setting' }), entry('x', 'Logs', { kind: 'screen' })], 'logs');
    expect(ranked.map((e) => e.id)).toEqual(['x', 's']);
  });
});

describe('buildCatalog', () => {
  it('keeps one entry per screen when the menu and the registry both name it', () => {
    const catalog = buildCatalog(input({
      menu: [{ key: 'lib', label: 'My library', screen: 'library' }],
      screens: [screen('library'), screen('home')],
    }));
    const screens = catalog.filter((e) => e.id === 'screen:library');
    expect(screens).toHaveLength(1);
    expect(screens[0]?.label).toBe('My library');
    expect(catalog.some((e) => e.id === 'screen:home')).toBe(false);
  });

  it('hides dev-only screens outside development and profile screens without a profile', () => {
    const screens = [screen('dev', { devOnly: true }), screen('saves', { requiresProfile: true }), screen('about', { requiresProfile: false })];
    const ids = buildCatalog(input({ screens, hasProfile: false, settings: null })).map((e) => e.id);
    expect(ids).toEqual(['screen:about']);
  });

  it('indexes settings tabs and fields with a toggle for boolean fields', () => {
    const patch = vi.fn();
    const catalog = buildCatalog(input({ patch }));
    expect(catalog.some((e) => e.id === 'tab:display')).toBe(true);
    const fullscreen = catalog.find((e) => e.id === 'setting:fullscreen');
    expect(fullscreen?.breadcrumb).toEqual(['Settings', 'Display', 'Window']);
    fullscreen?.toggle?.flip();
    expect(patch).toHaveBeenCalledWith({ fullscreen: false });
    expect(catalog.find((e) => e.id === 'setting:scale')?.toggle).toBeUndefined();
  });

  it('walks nested menu entries into a breadcrumb and adds registered actions', () => {
    const catalog = buildCatalog(input({
      menu: [{ key: 'widgets', label: 'Widgets', children: [{ key: 'widget-logs', label: 'Logs', onClick: () => undefined }] }],
      actions: [{ id: 'sync', label: 'Sync now', group: 'Cloud', run: () => undefined }],
    }));
    expect(catalog.find((e) => e.id === 'menu:widget-logs')?.breadcrumb).toEqual(['Widgets']);
    expect(catalog.find((e) => e.id === 'action:sync')?.breadcrumb).toEqual(['Cloud']);
  });
});
