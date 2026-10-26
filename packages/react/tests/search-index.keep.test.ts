/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { buildSearchIndex } from '../src/search/build-search-index';
import { entrySeed } from '../src/search/seeds/entry-seed';
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

  it('keeps two live entries with one label apart by id, and opens their params', () => {
    const live = [
      liveEntry({ label: 'Weekly', id: 'preset-1', params: { presetId: 'preset-1' } }, 'game/controls'),
      liveEntry({ label: 'Weekly', id: 'preset-2', params: { presetId: 'preset-2' } }, 'game/controls'),
    ];
    const found = buildCatalog(input({ live })).filter((candidate) => candidate.label === 'Weekly');
    expect(found.map((entry) => entry.id)).toEqual(['entry:game/controls#preset-1', 'entry:game/controls#preset-2']);
    expect(found[1]?.target).toEqual({ route: 'game/controls', params: { presetId: 'preset-2' } });
    expect(entriesInBucket(found, 'game')).toHaveLength(2);
  });

  it('turns widget menu toggles into widget entries', () => {
    const widgets = [{ key: 'widget-logs', label: 'Logs', checked: false, onClick: () => undefined }];
    expect(buildCatalog(input({ widgets })).find((entry) => entry.id === 'widget:logs')?.kind).toBe('widget');
  });
});

const ROW_SEEDS: SearchFileSeed[] = [
  { kind: 'page', bucket: 'game', id: 'engine', title: 'Engine', keywords: ['version', 'upgrade'], entries: [{ label: 'Installed build', keywords: ['patch'], anchor: 'build' }] },
  { kind: 'settings', bucket: 'game', id: 'about', title: 'About', keywords: ['version'] },
  { kind: 'page', bucket: 'game', id: 'version-notes', title: 'Version notes' },
  { kind: 'page-meta', bucket: 'data', id: 'tracker', title: 'Tracker', keywords: ['atlas'], entries: [{ label: 'Zoom level', anchor: 'zoom' }] },
  { kind: 'tab', bucket: 'data', page: 'tracker', id: 'map' },
  { kind: 'sub', bucket: 'game', page: 'engine', id: 'notes', title: 'Notes', path: 'notes', entries: [{ label: 'Changelog', anchor: 'log' }] },
  { kind: 'hero', bucket: 'game', id: 'home', entries: [{ label: 'Welcome back', anchor: 'welcome' }] },
];

describe('page keywords and declared rows', () => {
  const rows = buildSearchIndex(CONFIG, ROW_SEEDS);

  it('finds a page of every kind by a keyword of its meta', () => {
    const ids = rankEntries(rows, 'version').map((entry) => entry.id);
    expect(ids).toContain('screen:game/engine');
    expect(ids).toContain('screen:game/about');
    expect(rankEntries(rows, 'atlas').map((entry) => entry.id)).toContain('screen:data/tracker');
  });

  it('ranks a title match above a keyword match', () => {
    const ids = rankEntries(rows, 'version').map((entry) => entry.id);
    expect(ids.indexOf('screen:game/version-notes')).toBeLessThan(ids.indexOf('screen:game/engine'));
  });

  it('turns a declared row into a result that opens the page at its anchor', () => {
    const found = rankEntries(rows, 'patch')[0];
    expect(found).toMatchObject({ kind: 'entry', label: 'Installed build', breadcrumb: ['Game', 'Engine'], target: { route: 'game/engine', anchor: 'build' } });
    expect(rows.find((entry) => entry.label === 'Zoom level')).toMatchObject({ target: { route: 'data/tracker', anchor: 'zoom' } });
    expect(rows.find((entry) => entry.label === 'Changelog')).toMatchObject({ target: { route: 'game/engine/notes', anchor: 'log' } });
    expect(rows.find((entry) => entry.label === 'Welcome back')).toMatchObject({ target: { route: 'game', anchor: 'welcome' } });
  });

  it('seeds a module settings page and its meta rows from the screen entries', () => {
    const seeds = entrySeed({ kind: 'settings', id: 'about', bucket: 'game', sections: [], meta: { keywords: ['Version'], searchRows: [{ label: 'Build id', keywords: ['Hash'], anchor: 'id' }] } });
    const index = buildSearchIndex(CONFIG, seeds);
    expect(index.find((entry) => entry.id === 'screen:game/about')).toMatchObject({ kind: 'page', keywords: ['version'] });
    expect(index.find((entry) => entry.label === 'Build id')).toMatchObject({ keywords: ['hash'], target: { route: 'game/about', anchor: 'id' } });
  });
});
