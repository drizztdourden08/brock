/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { HubDef } from '../src/hub/hub.type';
import type { MenuItem } from '../src/menu/menu.type';
import { withRoutes } from '../src/menu/with-routes';
import { resolveRoute } from '../src/navigation/resolve-route';
import type { RouteAlias } from '../src/navigation/navigation.type';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { deriveMenu } from '../src/screens/conventions/derive-menu';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import type { TabDef } from '../src/settings/settings.type';

const View = () => null;

const CONFIG: ScreensConfig = {
  buckets: [
    { id: 'game', title: 'Game', icon: 'gamepad-2', menu: 'entry', groups: [{ id: 'video', label: 'Video' }, { id: 'audio', label: 'Audio' }] },
    { id: 'data', title: 'Data', icon: 'layers', menu: 'submenu' },
    { id: 'lab', title: 'Lab', icon: 'cpu', menu: 'hidden' },
  ],
  home: 'game',
};

const ENTRIES: ScreenEntry[] = [
  { kind: 'hero', bucket: 'game', id: 'home', component: View },
  { kind: 'page', bucket: 'game', id: 'saves', component: View, meta: { order: 2 } },
  { kind: 'page', bucket: 'game', id: 'about-run', component: View, meta: { title: 'Run', order: 1 } },
  { kind: 'settings', bucket: 'game', group: 'audio', id: 'mixer', sections: [] },
  { kind: 'settings', bucket: 'game', group: 'video', id: 'display', sections: [], meta: { shortcut: 'Mod+D' } },
  { kind: 'tab', bucket: 'game', page: 'tracker', id: 'map', component: View, meta: { order: 2 } },
  { kind: 'tab', bucket: 'game', page: 'tracker', id: 'items', component: View, meta: { order: 1 } },
  { kind: 'page', bucket: 'data', id: 'library', component: View },
  { kind: 'page', bucket: 'data', id: 'sources', component: View },
  { kind: 'page', bucket: 'lab', id: 'bench', component: View },
  { kind: 'card', id: 'credits', component: View, meta: { requiresProfile: false } },
  { kind: 'custom', bucket: 'game', id: 'controls', component: View, meta: { order: 3 } },
  { kind: 'layer', id: 'playfield', component: View },
];

const MODULE_TAB: TabDef<object> = { id: 'display-module', label: 'Monitor', navIcon: null, group: 'Hardware', sections: () => [] };

const hubOf = (hubs: readonly HubDef[], id: string): HubDef => {
  const hub = hubs.find((candidate) => candidate.id === id);
  if (!hub) throw new Error(`no hub ${id}`);
  return hub;
};

const pageIds = (hub: HubDef): string[][] => hub.groups.map((group) => [group.id, ...group.pages.map((page) => page.id)]);

const noAlias = (): RouteAlias | undefined => undefined;

describe('buildScreenTree', () => {
  const tree = buildScreenTree(CONFIG, ENTRIES);

  it('makes one hub per bucket in config order', () => {
    expect(tree.hubs.map((hub) => hub.id)).toEqual(['game', 'data', 'lab']);
  });

  it('puts the hero home, then the default group, then the config groups, with pages ordered by meta', () => {
    const game = hubOf(tree.hubs, 'game');
    expect(game.home.id).toBe('home');
    expect(pageIds(game)).toEqual([['game', 'about-run', 'saves', 'controls', 'tracker'], ['video', 'display'], ['audio', 'mixer']]);
    expect(game.groups[0]?.pages[0]?.label).toBe('Run');
  });

  it('turns a page folder into a page with ordered header tabs', () => {
    const tracker = hubOf(tree.hubs, 'game').groups[0]?.pages.find((page) => page.id === 'tracker');
    expect(tracker?.tabs?.map((tab) => tab.id)).toEqual(['items', 'map']);
  });

  it('turns a custom page into a hub page with the standard frame and search on', () => {
    const game = hubOf(tree.hubs, 'game');
    expect(game.groups[0]?.pages.find((page) => page.id === 'controls')?.label).toBe('Controls');
    expect(game.search?.placeholder).toBe('Search Game');
  });

  it('uses the first page as home when a bucket has no hero', () => {
    const data = hubOf(tree.hubs, 'data');
    expect(data.home.id).toBe('library');
    expect(pageIds(data)).toEqual([['data', 'sources']]);
  });

  it('makes card and layer screens, and settings files into tabs', () => {
    expect(tree.screens.map((screen) => [screen.id, screen.layer, screen.requiresProfile])).toEqual([['credits', 'fullscreen', false], ['playfield', 'own', true]]);
    expect(tree.tabs.map((tab) => tab.id)).toEqual(['game/mixer', 'game/display']);
    expect(tree.shortcuts).toEqual([{ shortcut: 'Mod+D', target: 'game/display' }]);
  });

  it('rejects a file in a bucket the config does not declare', () => {
    expect(() => buildScreenTree(CONFIG, [...ENTRIES, { kind: 'page', bucket: 'tools', id: 'x', component: View }]))
      .toThrow('src/screens/tools is not a bucket declared in screens.config.ts');
  });
});

describe('resolveScreenTree', () => {
  const resolved = resolveScreenTree(buildScreenTree(CONFIG, ENTRIES), [MODULE_TAB]);

  it('places the built-in settings tabs in the settings bucket', () => {
    const game = hubOf(resolved.hubs, 'game');
    expect(game.groups.at(-1)).toMatchObject({ id: 'settings-hardware', label: 'Hardware' });
    expect(resolved.tabs.map((tab) => tab.id)).toEqual(['game/mixer', 'game/display', 'display-module']);
    expect(resolved.screens.map((screen) => screen.id)).toEqual(['game', 'data', 'lab', 'credits', 'playfield']);
  });

  it('opens settings on the first settings page of the bucket, or on the page a tab names', () => {
    expect(resolveRoute('settings', {}, (name) => (name === 'settings' ? resolved.settingsAlias : undefined)))
      .toEqual({ active: 'game', params: { section: 'display', tab: undefined } });
    expect(resolved.settingsAlias({ tab: 'display-module', anchor: 'x' })).toEqual({ active: 'game/display-module', params: { anchor: 'x' } });
    expect(resolved.shortcuts[0]).toEqual({ shortcut: 'Mod+Comma', target: 'settings' });
  });

  it('honours settings.bucket', () => {
    const moved = resolveScreenTree(buildScreenTree({ ...CONFIG, settings: { bucket: 'data' } }, ENTRIES), [MODULE_TAB]);
    expect(hubOf(moved.hubs, 'data').groups.at(-1)?.id).toBe('settings-hardware');
    expect(hubOf(moved.hubs, 'game').groups.some((group) => group.id === 'settings-hardware')).toBe(false);
  });
});

describe('deriveMenu', () => {
  const tree = buildScreenTree(CONFIG, ENTRIES);
  const menu = deriveMenu(CONFIG, tree.hubs, tree.screens) as MenuItem[];

  it('skips the home bucket and hidden buckets, lists a submenu bucket by page, and adds non built-in cards', () => {
    expect(menu.map((item) => item.key)).toEqual(['bucket:data', 'screen:playfield']);
    expect(menu[0]?.children?.map((child) => child !== 'separator' && [child.bucket, child.page])).toEqual([['data', 'library'], ['data', 'sources']]);
  });

  it('turns bucket targets into deep links', () => {
    const [data] = withRoutes(menu) as MenuItem[];
    expect(data?.children?.map((child) => child !== 'separator' && child.screen)).toEqual(['data/library', 'data/sources']);
  });
});

describe('resolveRoute', () => {
  it('reads bucket, page and tab from a deep link', () => {
    expect(resolveRoute('game/tracker/map', { from: 'menu' }, noAlias)).toEqual({ active: 'game', params: { from: 'menu', section: 'tracker', tab: 'map' } });
    expect(resolveRoute('about', {}, noAlias)).toEqual({ active: 'about', params: {} });
  });
});
