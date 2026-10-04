/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { resolveHubPage } from '../src/hub/Hub/behavior/resolve-hub-page';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import type { MenuItem } from '../src/menu/menu.type';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { deriveMenu } from '../src/screens/conventions/derive-menu';
import { fillSubPath } from '../src/screens/conventions/fill-sub-path';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { buildSearchIndex } from '../src/search/build-search-index';
import { useScreenStateStore } from '../src/stores/useScreenStateStore';

const View = () => null;

const CONFIG: ScreensConfig = {
  buckets: [
    { id: 'multiworld', title: 'Multiworld', icon: 'layers', menu: 'entry', groups: [{ id: 'library', label: 'Library' }] },
    { id: 'data', title: 'Data', icon: 'hard-drive', menu: 'submenu' },
  ],
  home: 'multiworld',
};

const ENTRIES: ScreenEntry[] = [
  { kind: 'hero', bucket: 'multiworld', id: 'home', component: View },
  { kind: 'page', bucket: 'multiworld', group: 'library', id: 'sessions', component: View, meta: { menu: 'Multiworld', order: 1, header: { primary: { label: 'New session', icon: 'plus', open: 'new' }, search: { placeholder: 'Filter sessions' } } } },
  { kind: 'sub', bucket: 'multiworld', group: 'library', page: 'sessions', id: 'new', component: View, meta: { title: 'New session' } },
  { kind: 'sub', bucket: 'multiworld', group: 'library', page: 'sessions', id: 'edit', component: View, meta: { title: 'Edit session', path: ':id/edit' } },
  { kind: 'tab', bucket: 'multiworld', group: 'library', page: 'games', id: 'official', component: View },
  { kind: 'tab', bucket: 'multiworld', group: 'library', page: 'games', id: 'installed', component: View },
  { kind: 'page-meta', bucket: 'multiworld', group: 'library', id: 'games', meta: { menu: 'Multiworld', order: 2 } },
  { kind: 'page', bucket: 'multiworld', id: 'servers', component: View, meta: { menu: 'Multiworld/Hosting' } },
  { kind: 'page', bucket: 'data', id: 'overview', component: View },
  { kind: 'page', bucket: 'data', id: 'runs', component: View, meta: { menu: false } },
  { kind: 'page', bucket: 'data', id: 'export', component: View, meta: { menu: 'entry' } },
  { kind: 'card', id: 'credits', component: View },
  { kind: 'card', id: 'changelog', component: View, meta: { menu: 'Data' } },
  { kind: 'base', id: 'session', component: View, meta: { title: 'Session', icon: 'radio' } },
];

const tree = buildScreenTree(CONFIG, ENTRIES);

const hubOf = (id: string): HubDef => {
  const hub = tree.hubs.find((candidate) => candidate.id === id);
  if (!hub) throw new Error(`no hub ${id}`);
  return hub;
};

const pagesOf = (hub: HubDef): HubPage[] => [hub.home, ...hub.groups.flatMap((group) => group.pages)];

const pageOf = (hub: HubDef, id: string): HubPage => {
  const page = pagesOf(hub).find((candidate) => candidate.id === id);
  if (!page) throw new Error(`no page ${id}`);
  return page;
};

const labelOf = (item: MenuItem): unknown => (item.children ? [item.label, labels(item.children)] : item.label);

const labels = (items: readonly (MenuItem | 'separator')[] | undefined): unknown[] =>
  (items ?? []).map((item) => (item === 'separator' ? item : labelOf(item)));

describe('base screen', () => {
  it('becomes one screen drawn under the hubs, with no menu entry', () => {
    expect(tree.base).toMatchObject({ id: 'session', title: 'Session', layer: 'own', header: 'none' });
    const resolved = resolveScreenTree(tree, []);
    expect(resolved.base).toBe('session');
    expect(resolved.screens.map((screen) => screen.id)).toContain('session');
    expect(JSON.stringify(resolved.menu)).not.toContain('screen:session');
  });

  it('may not share its id with a bucket', () => {
    expect(() => buildScreenTree(CONFIG, [...ENTRIES, { kind: 'base', id: 'data', component: View }])).toThrow('the base screen "data" has the id of a bucket');
  });
});

describe('sub-pages', () => {
  const sessions = pageOf(hubOf('multiworld'), 'sessions');

  it('hang under their page with a route path', () => {
    expect(sessions.subs?.map((sub) => [sub.id, sub.path, sub.label])).toEqual([['new', 'new', 'New session'], ['edit', ':id/edit', 'Edit session']]);
  });

  it('resolve from the route, with their params, while tabs keep their ids', () => {
    const pages = pagesOf(hubOf('multiworld'));
    const home = hubOf('multiworld').home;
    expect(resolveHubPage(pages, home, { section: 'sessions', tab: '42/edit' })).toMatchObject({ page: { id: 'sessions' }, tab: null, sub: { id: 'edit' }, subParams: { id: '42' } });
    expect(resolveHubPage(pages, home, { section: 'sessions', tab: 'new' }).sub?.id).toBe('new');
    expect(resolveHubPage(pages, home, { section: 'games', tab: 'installed' })).toMatchObject({ tab: { id: 'installed' }, sub: null });
    expect(resolveHubPage(pages, home, { section: 'sessions', tab: 'nope' }).sub).toBeNull();
  });

  it('opens a tab page on its last tab when the route names none, and on the route tab when it does', () => {
    const pages = pagesOf(hubOf('multiworld'));
    const home = hubOf('multiworld').home;
    const [first, second] = (pageOf(hubOf('multiworld'), 'games').tabs ?? []).map((tab) => tab.id);
    expect(resolveHubPage(pages, home, { section: 'games' }).tab?.id).toBe(first);
    expect(resolveHubPage(pages, home, { section: 'games' }, { 'tab:games': second }).tab?.id).toBe(second);
    expect(resolveHubPage(pages, home, { section: 'games', tab: first }, { 'tab:games': second }).tab?.id).toBe(first);
    expect(resolveHubPage(pages, home, { section: 'games' }, { 'tab:games': 'gone' }).tab?.id).toBe(first);
  });

  it('are in the search index under their page, unless their path takes params', () => {
    const index = buildSearchIndex(CONFIG, [
      { kind: 'page', bucket: 'multiworld', group: 'library', id: 'sessions', title: 'Sessions' },
      { kind: 'sub', bucket: 'multiworld', group: 'library', page: 'sessions', id: 'new', title: 'New session' },
      { kind: 'sub', bucket: 'multiworld', group: 'library', page: 'sessions', id: 'edit', path: ':id/edit' },
      { kind: 'base', id: 'session', title: 'Session' },
    ]);
    expect(index.find((entry) => entry.label === 'New session')).toMatchObject({ breadcrumb: ['Multiworld', 'Library', 'Sessions'], target: { route: 'multiworld/sessions/new' } });
    expect(index.some((entry) => entry.target?.route.includes(':id'))).toBe(false);
    expect(index.find((entry) => entry.id === 'screen:session')?.kind).toBe('screen');
  });

  it('fill their path from params', () => {
    expect(fillSubPath(':id/edit', { id: 'a b' })).toBe('a%20b/edit');
  });
});

describe('page header actions', () => {
  it('carry the primary action and the search field from meta', () => {
    expect(pageOf(hubOf('multiworld'), 'sessions').header).toMatchObject({ primary: { label: 'New session', open: 'new' }, search: { placeholder: 'Filter sessions' } });
  });
});

describe('menu placement from meta', () => {
  const menu = deriveMenu(CONFIG, tree.hubs, tree.screens) as MenuItem[];

  it('nests pages under a path, creating the parents, in meta order', () => {
    const multiworld = menu.find((item) => item.label === 'Multiworld');
    expect(multiworld?.icon).toBe('layers');
    expect(labels(multiworld?.children)).toEqual(['Sessions', 'Games', ['Hosting', ['Servers']]]);
  });

  it('hides a page with menu false, lifts menu entry to the top, and merges into an existing entry', () => {
    expect(labels(menu)).toEqual([['Data', ['Overview', 'Changelog']], ['Multiworld', ['Sessions', 'Games', ['Hosting', ['Servers']]]], 'Export']);
    expect(menu.at(-1)).toMatchObject({ bucket: 'data', page: 'export' });
  });
});

describe('screen state', () => {
  it('keeps values per scope and hydrates them back', () => {
    const store = useScreenStateStore.getState();
    store.put('multiworld/sessions', 'filter', 'weekly');
    store.put('data/overview', 'filter', 'all');
    expect(useScreenStateStore.getState().byScope['multiworld/sessions']).toEqual({ filter: 'weekly' });
    store.hydrate({ about: { tab: 2 } });
    expect(useScreenStateStore.getState().byScope).toEqual({ about: { tab: 2 } });
    useScreenStateStore.reset();
  });
});
