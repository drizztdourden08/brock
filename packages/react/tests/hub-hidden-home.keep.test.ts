/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Hub } from '../src/hub/Hub';
import { buildHubNav } from '../src/hub/Hub/behavior/build-hub-nav';
import { navPageCount } from '../src/hub/Hub/behavior/nav-page-count';
import { resolveHubPage } from '../src/hub/Hub/behavior/resolve-hub-page';
import { showsHubNav } from '../src/hub/Hub/behavior/shows-hub-nav';
import { visibleHubPages } from '../src/hub/Hub/behavior/visible-hub-pages';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import { NO_PARAMS } from '../src/navigation/navigation.constants';
import type { ScreenParams } from '../src/navigation/navigation.type';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { showHarness } from './show-harness';

const CONFIG: ScreensConfig = { buckets: [{ id: 'studio', title: 'Studio', icon: 'cpu', menu: 'entry' }], home: 'studio' };

const ENTRIES: ScreenEntry[] = [
  { kind: 'hero', bucket: 'studio', id: 'home', component: () => createElement('p', null, 'home body') },
  { kind: 'page', bucket: 'studio', id: 'logs', component: () => createElement('p', null, 'logs body'), meta: { order: 1 } },
  { kind: 'page', bucket: 'studio', id: 'tools', component: () => createElement('p', null, 'tools body'), meta: { order: 2 } },
];

const builtHub = (): HubDef => {
  const hub = buildScreenTree(CONFIG, ENTRIES).hubs[0];
  if (!hub) throw new Error('no hub');
  return hub;
};

const hideHome = (hub: HubDef): HubDef => ({ ...hub, home: { ...hub.home, show: { when: () => false } } });

const hideAll = (hub: HubDef): HubDef => ({
  ...hideHome(hub),
  groups: hub.groups.map((group) => ({ ...group, pages: group.pages.map((page): HubPage => ({ ...page, show: { when: () => false } })) })),
});

const ids = (pages: readonly HubPage[]): string[] => pages.map((page) => page.id);

const draw = (def: HubDef, params: ScreenParams = NO_PARAMS): void => {
  const ctx = { params, profile: null, close: () => undefined, open: () => undefined };
  showHarness.render(createElement(PlatformProvider, null, createElement(Hub, { def, ctx })));
};

const navLabels = (): string[] => [...document.querySelectorAll('.side-nav__item')].map((item) => item.getAttribute('aria-label') ?? '');

afterEach(() => showHarness.resetShow());

describe('a hub whose home page is hidden', () => {
  const hub = hideHome(builtHub());

  it('keeps the home in the routable pages but marks it as not listed', () => {
    const list = visibleHubPages(hub, false);
    expect(ids(list.pages)).toEqual(['home', 'logs', 'tools']);
    expect(list.homeListed).toBe(false);
    expect(navPageCount(list)).toBe(2);
  });

  it('lists a shown home as before', () => {
    const list = visibleHubPages(builtHub(), false);
    expect(list.homeListed).toBe(true);
    expect(navPageCount(list)).toBe(3);
  });

  it('leaves the home out of the side nav config', () => {
    const list = visibleHubPages(hub, false);
    expect(buildHubNav(list.homeListed ? hub.home : undefined, list.groups)).not.toHaveProperty('home');
    expect(buildHubNav(hub.home, list.groups)).toHaveProperty('home');
  });

  it('still opens on the home by route', () => {
    const list = visibleHubPages(hub, false);
    expect(resolveHubPage(list.pages, hub.home, {}).page.id).toBe('home');
    expect(resolveHubPage(list.pages, hub.home, { section: 'home' }).page.id).toBe('home');
  });

  it('counts only the listed pages when it decides to draw the nav', () => {
    const one: HubDef = { ...hub, groups: hub.groups.map((group) => ({ ...group, pages: group.pages.slice(0, 1) })) };
    expect(showsHubNav(undefined, navPageCount(visibleHubPages(one, false)))).toBe(false);
    expect(showsHubNav(undefined, navPageCount(visibleHubPages(hub, false)))).toBe(true);
  });

  it('keeps the home in the nav when no other page is shown', () => {
    const list = visibleHubPages(hideAll(builtHub()), false);
    expect(list.homeListed).toBe(true);
    expect(ids(list.pages)).toEqual(['home']);
  });

  it('draws the nav without the home, and the home body for a route without a section', () => {
    draw(hub);
    expect(navLabels()).toEqual(['Logs', 'Tools']);
    expect(document.body.textContent).toContain('home body');
  });

  it('draws the nav with the home when it is shown', () => {
    draw(builtHub());
    expect(navLabels()).toEqual(['Home', 'Logs', 'Tools']);
  });
});
