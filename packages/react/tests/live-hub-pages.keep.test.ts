/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, useSyncExternalStore } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hub } from '../src/hub/Hub';
import { hubPageEntries } from '../src/hub/Hub/behavior/hub-page-entries';
import { pageIdOf } from '../src/hub/Hub/behavior/page-id-of';
import { liveParams } from '../src/hub/Hub/behavior/live-params';
import { resolveHubPage } from '../src/hub/Hub/behavior/resolve-hub-page';
import { visibleHubPages } from '../src/hub/Hub/behavior/visible-hub-pages';
import type { HubDef, HubPage, LivePage } from '../src/hub/hub.type';
import { NO_PARAMS } from '../src/navigation/navigation.constants';
import type { ScreenParams } from '../src/navigation/navigation.type';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { deriveMenu } from '../src/screens/conventions/derive-menu';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { showHarness } from './show-harness';

const View = () => createElement('p', null, 'static page');

const CONFIG: ScreensConfig = { buckets: [{ id: 'controllers', title: 'Controllers', icon: 'gamepad-2', menu: 'entry' }], home: 'controllers' };

const store: { pads: LivePage[]; listeners: Set<() => void> } = { pads: [], listeners: new Set() };

const setPads = (pads: LivePage[]): void => {
  act(() => {
    store.pads = pads;
    store.listeners.forEach((listener) => listener());
  });
};

const subscribe = (listener: () => void): (() => void) => {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
};

const usePads = (): readonly LivePage[] => useSyncExternalStore(subscribe, () => store.pads);

const pad = (key: string, extra: Partial<LivePage> = {}): LivePage => ({ key, title: `Pad ${key}`, render: () => createElement('p', null, `pad ${key} body`), ...extra });

const ENTRIES: ScreenEntry[] = [
  { kind: 'hero', bucket: 'controllers', id: 'home', component: View },
  { kind: 'page', bucket: 'controllers', id: 'logs', component: View, meta: { order: 3 } },
  { kind: 'live', bucket: 'controllers', id: 'pads', usePages: usePads, meta: { icon: 'gamepad-2', empty: 'No controller connected', order: 2, keywords: ['gamepad'] } },
  { kind: 'page', bucket: 'controllers', id: 'directory', component: () => createElement('p', null, 'directory body'), meta: { order: 1 } },
  { kind: 'page', bucket: 'controllers', id: 'diagnostics', component: View, meta: { order: 4 } },
];

const treeHub = (): HubDef => {
  const hub = buildScreenTree(CONFIG, ENTRIES).hubs[0];
  if (!hub) throw new Error('no hub');
  return hub;
};

const ids = (pages: readonly HubPage[]): string[] => pages.map((page) => page.id);

const draw = (params: ScreenParams = NO_PARAMS, open: (target: string, params?: ScreenParams) => void = () => undefined): void => {
  const ctx = { params, profile: null, close: () => undefined, open };
  showHarness.render(createElement(PlatformProvider, null, createElement(Hub, { def: treeHub(), ctx })));
};

const navLabels = (): string[] => [...document.querySelectorAll('.side-nav__item')].map((item) => item.getAttribute('aria-label') ?? '');

const navItem = (label: string): HTMLElement | null => document.querySelector(`.side-nav__item[aria-label="${label}"]`);

afterEach(() => {
  showHarness.resetShow();
  store.pads = [];
});

describe('a live page in the screen tree', () => {
  it('sits among the static pages of its group by meta.order and stays out of the menu', () => {
    const hub = treeHub();
    expect(hub.groups[0]?.pages.map((page) => page.id)).toEqual(['directory', 'pads', 'logs', 'diagnostics']);
    expect(hub.groups[0]?.pages[1]).toMatchObject({ label: 'Pads', menu: false, live: { meta: { empty: 'No controller connected' } } });
    const tree = buildScreenTree(CONFIG, ENTRIES);
    expect(JSON.stringify(deriveMenu(CONFIG, tree.hubs, tree.screens))).not.toContain('pads');
  });

  it('is never the home of a bucket with no hero', () => {
    const noHero = ENTRIES.filter((entry) => entry.kind !== 'hero');
    const hub = buildScreenTree(CONFIG, noHero).hubs[0];
    expect(hub?.home.id).toBe('directory');
    expect(hub?.groups[0]?.pages.map((page) => page.id)).toEqual(['pads', 'logs', 'diagnostics']);
  });
});

describe('the pages a hub shows for its live sources', () => {
  const hub = treeHub();

  it('keeps the static pages in order around the live ones', () => {
    const { pages } = visibleHubPages(hub, false, undefined, { pads: [pad('a'), pad('b')] });
    expect(ids(pages)).toEqual(['home', 'directory', 'pads/a', 'pads/b', 'logs', 'diagnostics']);
  });

  it('follows the list as entries come and go, and drops a repeated key', () => {
    expect(ids(visibleHubPages(hub, false, undefined, { pads: [pad('a')] }).pages)).toEqual(['home', 'directory', 'pads/a', 'logs', 'diagnostics']);
    expect(ids(visibleHubPages(hub, false, undefined, { pads: [pad('b'), pad('a'), pad('b')] }).pages)).toEqual(['home', 'directory', 'pads/b', 'pads/a', 'logs', 'diagnostics']);
    expect(ids(visibleHubPages(hub, false, undefined, {}).pages)).toEqual(['home', 'directory', 'logs', 'diagnostics']);
  });

  it('lists the empty text as a disabled nav entry that is not a page', () => {
    const { groups, pages } = visibleHubPages(hub, false);
    const empty = groups[0]?.pages.find((page) => page.id === 'pads');
    expect(empty).toMatchObject({ label: 'No controller connected', disabled: true });
    expect(ids(pages)).not.toContain('pads');
  });

  it('names the first static page of the group as the fallback', () => {
    expect(visibleHubPages(hub, false).fallbacks.get('pads')?.id).toBe('directory');
  });

  it('gives each entry the source keywords and the status badge', () => {
    const { pages } = visibleHubPages(hub, false, undefined, { pads: [pad('a', { badge: 'warn' })] });
    const live = pages.find((page) => page.id === 'pads/a');
    expect(live?.keywords).toEqual(['gamepad']);
    expect(live?.badge).not.toBeUndefined();
    expect(hubPageEntries(hub, pages).find((entry) => entry.label === 'Pad a')?.keywords).toEqual(['gamepad']);
  });

  it('reads the page of a search route that names a live entry', () => {
    const entry = { id: 'x', kind: 'page' as const, label: 'Pad a', keywords: [], breadcrumb: [], target: { route: 'controllers/pads/a' } };
    expect(pageIdOf(hub, entry)).toBe('pads/a');
    expect(pageIdOf(hub, { ...entry, target: { route: 'controllers/logs' } })).toBe('logs');
  });
});

describe('the selection of a live entry', () => {
  const hub = treeHub();
  const list = visibleHubPages(hub, false, undefined, { pads: [pad('a'), pad('b')] });
  const resolve = (params: ScreenParams, from = list) => resolveHubPage(from.pages, hub.home, liveParams(from.pages, from.fallbacks, params), {});

  it('opens the entry named by section and tab', () => {
    expect(resolve({ section: 'pads', tab: 'b' }).page.id).toBe('pads/b');
  });

  it('opens the first entry when the route names no key', () => {
    expect(resolve({ section: 'pads' }).page.id).toBe('pads/a');
  });

  it('falls back to the first static page of the group when the entry is gone', () => {
    const after = visibleHubPages(hub, false, undefined, { pads: [pad('b')] });
    expect(resolve({ section: 'pads', tab: 'a' }, after).page.id).toBe('directory');
    expect(resolve({ section: 'pads' }, visibleHubPages(hub, false)).page.id).toBe('directory');
  });

  it('keeps the selection when the same key comes back', () => {
    const back = visibleHubPages(hub, false, undefined, { pads: [pad('a')] });
    expect(resolve({ section: 'pads', tab: 'a' }, back).page.id).toBe('pads/a');
  });

  it('leaves a static page alone', () => {
    expect(resolve({ section: 'logs' }).page.id).toBe('logs');
  });
});

describe('a hub with a live source', () => {
  it('draws the empty text in the nav, then an entry for each connected pad with its badge', () => {
    draw();
    expect(navLabels()).toEqual(['Home', 'Directory', 'No controller connected', 'Logs', 'Diagnostics']);
    expect(navItem('No controller connected')?.hasAttribute('disabled')).toBe(true);
    setPads([pad('a', { badge: 'ok' }), pad('b', { badge: 'warn' })]);
    expect(navLabels()).toEqual(['Home', 'Directory', 'Pad a', 'Pad b', 'Logs', 'Diagnostics']);
    expect(navItem('Pad a')?.querySelector('[aria-label="OK"]')).not.toBeNull();
    expect(navItem('Pad b')?.querySelector('[aria-label="Needs attention"]')).not.toBeNull();
  });

  it('shows the body of the selected entry, and the first static page once the entry is unplugged', () => {
    setPads([pad('a'), pad('b')]);
    draw({ section: 'pads', tab: 'b' });
    expect(document.body.textContent).toContain('pad b body');
    expect(navItem('Pad b')?.getAttribute('aria-current')).toBe('page');
    setPads([pad('a')]);
    expect(document.body.textContent).not.toContain('pad b body');
    expect(document.body.textContent).toContain('directory body');
    expect(navItem('Directory')?.getAttribute('aria-current')).toBe('page');
  });

  it('opens an entry as section and tab', () => {
    const open = vi.fn();
    setPads([pad('a')]);
    draw(NO_PARAMS, open);
    act(() => navItem('Pad a')?.click());
    expect(open).toHaveBeenCalledWith('controllers', { section: 'pads', tab: 'a' });
  });
});
