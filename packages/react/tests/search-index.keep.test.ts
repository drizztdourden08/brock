/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { buildSearchIndex } from '../src/search/build-search-index';
import { buildCatalog } from '../src/search/catalog/build-catalog';
import { entriesInBucket } from '../src/search/entries-in-bucket';
import { liveEntry } from '../src/search/live-entry';
import { normaliseKeywords } from '../src/search/normalise-keywords';
import { rankEntries } from '../src/search/rank-entries';
import type { CatalogInput, SearchFileSeed } from '../src/search/search.type';

const CONFIG: ScreensConfig = {
  buckets: [
    { id: 'game', title: 'Game', icon: 'gamepad-2', menu: 'entry', groups: [{ id: 'video', label: 'Video' }] },
    { id: 'data', title: 'Data', icon: 'layers', menu: 'submenu' },
  ],
  home: 'game',
};

const SEEDS: SearchFileSeed[] = [
  { kind: 'hero', bucket: 'game', id: 'home', title: 'Home', keywords: ['start'] },
  { kind: 'settings', bucket: 'game', group: 'video', id: 'display', title: 'Display', sections: [
    { id: 'window', title: 'Window', rows: [{ key: 'windowMode', label: 'Window mode', description: 'Windowed or fullscreen.', keywords: ['borderless'] }] },
  ] },
  { kind: 'custom', bucket: 'game', id: 'controls', keywords: ['bindings'], entries: [{ label: 'Jump', keywords: ['space'], anchor: 'jump' }] },
  { kind: 'tab', bucket: 'data', page: 'tracker', id: 'map', title: 'World map' },
  { kind: 'page', bucket: 'data', id: 'library', devOnly: true },
  { kind: 'card', id: 'credits' },
];

const INDEX = buildSearchIndex(CONFIG, SEEDS);

const byId = (id: string) => INDEX.find((entry) => entry.id === id);

const input = (extra: Partial<CatalogInput> = {}): CatalogInput => ({
  index: INDEX,
  live: [],
  menu: [],
  widgets: [],
  screens: [],
  home: '',
  tabs: [],
  settingsPlace: { bucket: 'game', title: 'Game' },
  settings: { windowMode: 'windowed' },
  patch: () => undefined,
  actions: [],
  isDev: false,
  isMobile: false,
  hasProfile: true,
  ...extra,
});

describe('normaliseKeywords', () => {
  it('folds case and accents, splits words and drops edge punctuation and repeats', () => {
    expect(normaliseKeywords(['Élan, Rapide', 'button A', '(space)', 'elan'])).toEqual(['elan', 'rapide', 'button', 'a', 'space']);
    expect(normaliseKeywords('Fast  travel')).toEqual(['fast', 'travel']);
    expect(normaliseKeywords(undefined)).toEqual([]);
  });
});

describe('buildSearchIndex', () => {
  it('makes one entry per bucket with the hero keywords, and one per page, tab and card', () => {
    expect(byId('screen:game')).toMatchObject({ kind: 'screen', label: 'Game', target: { route: 'game' }, keywords: ['start', 'home'] });
    expect(byId('screen:game/display')).toMatchObject({ kind: 'page', label: 'Display', breadcrumb: ['Game', 'Video'] });
    expect(byId('screen:game/controls')).toMatchObject({ label: 'Controls', icon: 'puzzle', keywords: ['bindings'] });
    expect(byId('screen:data/tracker')).toMatchObject({ kind: 'page', label: 'Tracker' });
    expect(byId('screen:data/tracker/map')).toMatchObject({ kind: 'tab', label: 'World map', breadcrumb: ['Data', 'Tracker'] });
    expect(byId('screen:credits')).toMatchObject({ kind: 'screen', label: 'Credits', target: { route: 'credits' } });
  });

  it('names a tab page from its page meta seed', () => {
    const index = buildSearchIndex(CONFIG, [...SEEDS, { kind: 'page-meta', bucket: 'data', id: 'tracker', title: 'Map room', icon: 'map', keywords: ['atlas'] }]);
    expect(index.find((entry) => entry.id === 'screen:data/tracker')).toMatchObject({ kind: 'page', label: 'Map room', icon: 'map', keywords: ['atlas'] });
    expect(index.find((entry) => entry.id === 'screen:data/tracker/map')).toMatchObject({ breadcrumb: ['Data', 'Map room'] });
  });

  it('indexes settings sections and rows with the row key as anchor', () => {
    expect(byId('section:game/display#window')).toMatchObject({ kind: 'section', target: { route: 'game/display', anchor: 'window' } });
    expect(byId('setting:windowMode')).toMatchObject({
      label: 'Window mode',
      breadcrumb: ['Game', 'Video', 'Display', 'Window'],
      target: { route: 'game/display', anchor: 'windowMode' },
      keywords: ['borderless'],
    });
  });

  it('indexes the searchEntries of a custom page under that page', () => {
    expect(byId('entry:game/controls#jump')).toMatchObject({ kind: 'entry', breadcrumb: ['Game', 'Controls'], target: { route: 'game/controls', anchor: 'jump' } });
  });
});

describe('entriesInBucket', () => {
  it('keeps the entries whose target opens that bucket', () => {
    const ids = entriesInBucket(INDEX, 'game').map((entry) => entry.id);
    expect(ids).toContain('setting:windowMode');
    expect(ids).toContain('entry:game/controls#jump');
    expect(ids).not.toContain('screen:data/tracker/map');
    expect(ids).not.toContain('screen:credits');
  });
});

describe('ranking the index', () => {
  it('finds a custom page entry by keyword and a setting by its full label first', () => {
    expect(rankEntries(INDEX, 'space')[0]?.id).toBe('entry:game/controls#jump');
    expect(rankEntries(INDEX, 'window mode')[0]?.id).toBe('setting:windowMode');
    expect(rankEntries(INDEX, 'borderless')[0]?.id).toBe('setting:windowMode');
  });
});

describe('buildCatalog with the index', () => {
  it('hides dev-only pages without developer tools and adds a toggle only to boolean settings', () => {
    expect(buildCatalog(input()).some((entry) => entry.id === 'screen:data/library')).toBe(false);
    expect(buildCatalog(input({ isDev: true })).some((entry) => entry.id === 'screen:data/library')).toBe(true);
    expect(buildCatalog(input()).find((entry) => entry.id === 'setting:windowMode')?.toggle).toBeUndefined();
  });

  it('keeps the index entry when the menu opens the same target', () => {
    const catalog = buildCatalog(input({ menu: [{ key: 'data-map', label: 'Map', screen: 'data/tracker/map' }] }));
    expect(catalog.filter((entry) => entry.target?.route === 'data/tracker/map').map((entry) => entry.label)).toEqual(['World map']);
  });

  it('places live entries under the page that registered them', () => {
    const live = [liveEntry({ label: 'Pack of cards', keywords: ['Deck'] }, 'game/controls')];
    const entry = buildCatalog(input({ live })).find((candidate) => candidate.label === 'Pack of cards');
    expect(entry).toMatchObject({ breadcrumb: ['Game', 'Controls'], keywords: ['deck'], target: { route: 'game/controls' } });
  });

  it('turns widget menu toggles into widget entries', () => {
    const widgets = [{ key: 'widget-logs', label: 'Logs', checked: false, onClick: () => undefined }];
    expect(buildCatalog(input({ widgets })).find((entry) => entry.id === 'widget:logs')?.kind).toBe('widget');
  });
});
