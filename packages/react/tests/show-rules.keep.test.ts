/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { Profile } from '@drizztdourden08/brock-core';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { visibleHubPages } from '../src/hub/Hub/behavior/visible-hub-pages';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { buildCatalog } from '../src/search/catalog/build-catalog';
import type { CatalogInput, SearchEntry } from '../src/search/search.type';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { deriveMenu } from '../src/screens/conventions/derive-menu';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { isScreenAllowed } from '../src/screens/is-screen-allowed';
import { hiddenRoutes } from '../src/screens/show/hidden-routes';
import { isShown } from '../src/screens/show/is-shown';
import type { ShowContext } from '../src/screens/show/show.type';

const View = () => null;
const noop = (): void => undefined;

const profile = (extra: Record<string, unknown>): Profile => ({ id: 'p1', name: 'Player', created: 0, lastPlayed: 0, ...extra });

const DESKTOP: ShowContext = { profile: profile({}), host: 'electron', formFactor: 'desktop', flags: {} };
const PHONE: ShowContext = { profile: profile({}), host: 'capacitor', formFactor: 'mobile', flags: {} };
const RANKED: ShowContext = { ...DESKTOP, profile: profile({ mode: 'ranked' }) };

const CONFIG: ScreensConfig = {
  buckets: [
    { id: 'game', title: 'Game', icon: 'gamepad-2', menu: 'submenu' },
    { id: 'studio', title: 'Studio', icon: 'cpu', menu: 'entry', hosts: ['electron'] },
  ],
  home: 'game',
};

const ENTRIES: ScreenEntry[] = [
  { kind: 'page', bucket: 'game', id: 'play', component: View, meta: { order: 0 } },
  { kind: 'page', bucket: 'game', id: 'touch', component: View, meta: { hosts: ['capacitor'] } },
  { kind: 'page', bucket: 'game', id: 'ladder', component: View, meta: { when: ({ profile: who }) => who?.['mode' as keyof Profile] === 'ranked' } },
  { kind: 'page', bucket: 'studio', id: 'editor', component: View },
  { kind: 'card', id: 'mods', component: View, meta: { hosts: ['electron', 'web'] } },
];

const tree = buildScreenTree(CONFIG, ENTRIES);
const hubOf = (id: string) => tree.hubs.find((hub) => hub.id === id);
const labels = (entries: readonly MenuEntry[]): string[] => entries.flatMap((entry) => (entry === 'separator' ? [] : [entry.label, ...labels(entry.children ?? [])]));

describe('pages, buckets and cards shown per host or per profile', () => {
  it('reads hosts and when from a page meta and a bucket', () => {
    expect(isShown(undefined, PHONE)).toBe(true);
    expect(isShown({ hosts: ['capacitor'] }, DESKTOP)).toBe(false);
    expect(isShown({ hosts: ['capacitor'] }, PHONE)).toBe(true);
    expect(isShown({ when: (ctx) => ctx.formFactor === 'mobile' }, PHONE)).toBe(true);
    const game = hubOf('game');
    expect(game && visibleHubPages(game, false, DESKTOP).pages.map((page) => page.id)).toEqual(['play']);
    expect(game && visibleHubPages(game, false, PHONE).pages.map((page) => page.id)).toEqual(['play', 'touch']);
    expect(game && visibleHubPages(game, false, RANKED).pages.map((page) => page.id)).toEqual(['play', 'ladder']);
    expect(hubOf('studio')?.show?.hosts).toEqual(['electron']);
  });

  it('hides a bucket, a page and a card from the menu where they are not shown', () => {
    const appMenu = deriveMenu(CONFIG, tree.hubs, tree.screens);
    const menuOn = (show: ShowContext): string[] => labels(buildMenu({ appMenu, moduleMenu: [], widgets: [], homeScreen: 'game', hasCredits: false, developerTools: false, show, onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop }));
    expect(menuOn(DESKTOP)).toEqual(expect.arrayContaining(['Studio', 'Mods', 'Play']));
    expect(menuOn(DESKTOP)).not.toContain('Touch');
    expect(menuOn(PHONE)).toEqual(expect.arrayContaining(['Play', 'Touch']));
    expect(menuOn(PHONE)).not.toContain('Studio');
    expect(menuOn(PHONE)).not.toContain('Mods');
  });

  it('keeps a hidden screen closed and out of search', () => {
    const mods = tree.screens.find((screen) => screen.id === 'mods');
    expect(mods && isScreenAllowed(mods, false, true, DESKTOP)).toBe(true);
    expect(mods && isScreenAllowed(mods, false, true, PHONE)).toBe(false);
    const hidden = hiddenRoutes(tree.hubs, tree.screens, PHONE);
    expect([...hidden].sort()).toEqual(['game/ladder', 'mods', 'studio']);
    const entry = (route: string): SearchEntry => ({ id: route, kind: 'page', label: route, keywords: [], breadcrumb: [], target: { route } });
    const input: CatalogInput = {
      index: [entry('game/play'), entry('game/ladder'), entry('studio/editor'), entry('game/touch')],
      live: [], menu: [], widgets: [], screens: [], home: 'game', tabs: [], settingsPlace: { bucket: null, title: 'Settings' },
      settings: null, patch: noop, actions: [], isDev: false, isMobile: true, hasProfile: true, hidden, show: PHONE,
    };
    expect(buildCatalog(input).map((found) => found.id)).toEqual(['game/play', 'game/touch']);
  });
});

describe('the menu item rule', () => {
  it('passes the show context through every level of the menu', () => {
    const tools: MenuItem = { key: 'tools', label: 'Tools', children: [{ key: 'pad', label: 'Pad', onClick: noop, show: { hosts: ['capacitor'] } }] };
    const menu = buildMenu({ appMenu: [tools], moduleMenu: [], widgets: [], homeScreen: 'game', hasCredits: false, developerTools: false, show: DESKTOP, onQuit: noop, onDevConsole: noop, onReportBug: noop, onShortcuts: noop });
    expect(labels(menu)).not.toContain('Pad');
  });
});
