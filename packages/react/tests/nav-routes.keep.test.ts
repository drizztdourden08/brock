/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { controlSources } from '../src/app/control-sources';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import { nav } from '../src/navigation/nav';
import { createScreenRegistry } from '../src/screens/create-screen-registry';
import type { ResolvedScreenTree } from '../src/screens/conventions/screen-tree.type';
import type { ScreenDef } from '../src/screens/screen.type';

const screen = (id: string, extra: Partial<ScreenDef> = {}): ScreenDef => ({ id, title: id.toUpperCase(), icon: null, render: () => null, requiresProfile: false, ...extra });

const page = (id: string, extra: Partial<HubPage> = {}): HubPage => ({ id, label: id.toUpperCase(), icon: null, render: () => null, ...extra });

const HUB: HubDef = {
  id: 'game',
  title: 'Game',
  icon: null,
  home: page('home'),
  groups: [{
    id: 'main',
    label: 'Main',
    pages: [
      page('tracker', { tabs: [{ id: 'map', label: 'Map', render: () => null }], subs: [{ id: 'run', label: 'Run', icon: null, path: 'run/:id', render: () => null }] }),
      page('lab', { devOnly: true }),
    ],
  }],
};

const TREE: ResolvedScreenTree = {
  home: 'game',
  base: null,
  settingsBucket: 'settings',
  hubs: [HUB],
  screens: [],
  tabs: [],
  menu: [],
  shortcuts: [],
  settingsAlias: (params) => ({ active: 'settings', params }),
  search: [],
};

let release: (() => void) | null = null;

const publish = (): void => {
  const screens = createScreenRegistry([screen('about'), screen('game'), screen('debug', { devOnly: true })]);
  release = controlSources.publish({ tabs: [], settings: null, screens, tree: TREE });
};

afterEach(() => {
  release?.();
  release = null;
});

describe('nav.routes', () => {
  it('is empty before the app publishes its screens', () => {
    expect(nav.routes()).toEqual([]);
  });

  it('lists screens and hub pages with titles and section ids, without developer pages', () => {
    publish();
    const routes = nav.routes();
    expect(routes.map((route) => route.route)).toEqual(['about', 'game', 'game/home', 'game/tracker', 'game/tracker/map', 'game/tracker/run/:id']);
    expect(routes.find((route) => route.route === 'about')).toEqual({ route: 'about', title: 'ABOUT', kind: 'screen', screen: 'about', section: null, tab: null });
    expect(routes.find((route) => route.route === 'game')).toMatchObject({ kind: 'hub', title: 'Game' });
    expect(routes.find((route) => route.route === 'game/tracker/map')).toEqual({ route: 'game/tracker/map', title: 'Map', kind: 'tab', screen: 'game', section: 'tracker', tab: 'map' });
    expect(routes.find((route) => route.route === 'game/tracker')).toMatchObject({ kind: 'page', section: 'tracker', title: 'TRACKER' });
  });
});
