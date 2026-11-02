/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { lazyComponent } from '../src/lazy/lazy-component';
import { LazyHost } from '../src/lazy/LazyHost';
import { preloadRoute } from '../src/lazy/preload-route';
import { routePreloader } from '../src/lazy/route-preloader';
import { resolveMenu } from '../src/menu/resolve-menu';
import { toMenuGroups } from '../src/menu/to-menu-groups';
import { withPreload } from '../src/menu/with-preload';
import type { MenuItem as TesseraMenuItem } from '@drizztdourden08/tessera/composites';
import { buildHubNav } from '../src/hub/Hub/behavior/build-hub-nav';
import { paletteGroups } from '../src/palette/PaletteHost/behavior/palette-groups';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { defineHub } from '../src/hub/define-hub';
import { createScreenRegistry } from '../src/screens/create-screen-registry';
import { lazyTitleBarButton } from '../src/title-bar/lazy-title-bar-button';
import { lazyTour } from '../src/tours/lazy-tour';
import { toursFromFiles } from '../src/tours/tours-from-files';
import { tours } from '../src/tours/tours';
import { EMPTY_PROGRESS, NO_TOURS } from '../src/tours/tours.constants';
import { useTourStore } from '../src/tours/useTourStore';
import { tourProgress } from '../src/tours/tour-progress';
import type { TourDef } from '../src/tours/tour.type';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const flush = async (): Promise<void> => {
  await act(async () => {
    for (let turn = 0; turn < 20; turn += 1) await Promise.resolve();
  });
};

const roots: Root[] = [];

const render = async (element: ReturnType<typeof createElement>): Promise<HTMLElement> => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  await act(async () => {
    root.render(element);
    await Promise.resolve();
  });
  return host;
};

const Blank = () => null;

const Page = (props: { name: string }) => createElement('p', { className: 'page' }, `Page ${props.name}`);

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.replaceChildren();
  useTourStore.setState({ tours: NO_TOURS, active: null, progress: EMPTY_PROGRESS });
});

describe('S2 lazyComponent', { tags: ['standard'] }, () => {
  it('draws at once with no loading state once it was preloaded', async () => {
    let calls = 0;
    const Lazy = lazyComponent(() => { calls += 1; return Promise.resolve({ default: Page }); });
    await Promise.all([Lazy.preload(), Lazy.preload()]);
    expect(calls).toBe(1);
    const host = await render(createElement(LazyHost, null, createElement(Lazy, { name: 'two' })));
    expect(host.querySelector('[data-brock-loading]')).toBeNull();
    expect(host.textContent).toBe('Page two');
  });

  it('loads again after a failed load, so Retry can recover', async () => {
    let calls = 0;
    const Lazy = lazyComponent((): Promise<{ default: ComponentType<{ name: string }> }> => {
      calls += 1;
      return calls === 1 ? Promise.reject(new Error('offline')) : Promise.resolve({ default: Page });
    });
    await expect(Lazy.preload()).rejects.toThrow('offline');
    await expect(Lazy.preload()).resolves.toBe(Page);
    expect(calls).toBe(2);
  });
});

const CONFIG = { buckets: [{ id: 'game', title: 'Game', icon: 'gamepad-2' as const, menu: 'entry' as const }], home: 'game' };

const loaderTree = () => {
  const loaded: string[] = [];
  const loader = (name: string) => lazyComponent(() => { loaded.push(name); return Promise.resolve({ default: Blank }); });
  const tree = buildScreenTree(CONFIG, [
    { kind: 'hero', bucket: 'game', id: 'home', component: loader('hero') },
    { kind: 'page', bucket: 'game', id: 'saves', component: loader('saves'), meta: { title: 'Saves' } },
    { kind: 'tab', bucket: 'game', page: 'tracker', id: 'map', component: loader('map') },
    { kind: 'card', id: 'credits', component: loader('credits'), meta: { title: 'Credits' } },
  ]);
  const registry = createScreenRegistry([...tree.hubs.map(defineHub), ...tree.screens]);
  return { loaded, registry };
};

describe('S2 preloading', { tags: ['standard'] }, () => {
  it('preloads a card, a hub home, a hub page and a tab by route', async () => {
    const { loaded, registry } = loaderTree();
    for (const route of ['credits', 'game', 'game/saves', 'game/tracker/map', 'missing']) preloadRoute(registry, route);
    await flush();
    expect(loaded.sort()).toEqual(['credits', 'hero', 'map', 'saves']);
  });

  it('preloads the screen a highlighted menu row opens, after a rename and a move', async () => {
    const { loaded, registry } = loaderTree();
    const groups = { main: [{ key: 'saves-entry', label: 'Saves', screen: 'game/saves' }], sections: [], modules: [], end: [{ key: 'credits', label: 'Credits', screen: 'credits' }] };
    const { entries } = resolveMenu({ groups, config: { entries: { 'saves-entry': { label: 'Save files', before: 'credits' } } } });
    const [group] = toMenuGroups(withPreload(entries, routePreloader(registry)), { openScreen: () => undefined });
    const items = (group?.items ?? []).filter((item): item is TesseraMenuItem => 'label' in item);
    expect(items.map((item) => item.label)).toEqual(['Save files', 'Credits']);
    items[0]?.onHighlight?.();
    await flush();
    expect(loaded).toEqual(['saves']);
  });

  it('preloads from a hub nav entry and a palette row by their route, not their label', async () => {
    const { loaded, registry } = loaderTree();
    const preload = routePreloader(registry);
    const nav = buildHubNav({ id: 'saves', label: 'Saves' } as never, [], (page) => preload(`game/${page}`));
    nav.home?.onHighlight?.();
    const [palette] = paletteGroups([{ id: 'screen:credits', kind: 'screen', label: 'Credits', breadcrumb: [], keywords: [], target: { route: 'credits' } }], '', null, preload);
    palette?.items[0]?.onHighlight?.();
    await flush();
    expect(loaded.sort()).toEqual(['credits', 'saves']);
  });
});

describe('S2 a lazy title bar button', { tags: ['standard'] }, () => {
  it('keeps its look at boot and loads its handler on the first click', async () => {
    let selected = 0;
    let loads = 0;
    const button = lazyTitleBarButton({ kind: 'button', label: 'Export', icon: 'download' }, () => {
      loads += 1;
      return Promise.resolve({ default: { kind: 'button' as const, label: 'Export', icon: 'download' as const, onSelect: () => { selected += 1; } } });
    });
    expect(button.label).toBe('Export');
    expect(loads).toBe(0);
    button.onSelect();
    await flush();
    expect(loads).toBe(1);
    expect(selected).toBe(1);
  });
});

const WELCOME: TourDef = { id: 'welcome', title: 'Welcome', steps: [{ id: 'one', title: 'One', body: 'First.' }, { id: 'two', title: 'Two', body: 'Second.' }] };

describe('S2 a lazy tour', { tags: ['standard'] }, () => {
  it('lists its title and trigger at boot, counts as a first-run tour and loads its steps when it starts', async () => {
    let loads = 0;
    const [listed] = toursFromFiles([{ id: 'welcome', tour: lazyTour({ title: 'Welcome', trigger: 'first-run' }, () => { loads += 1; return Promise.resolve({ default: WELCOME }); }) }]);
    expect(listed?.steps).toEqual([]);
    expect(tourProgress.firstRun(listed ? [listed] : [], EMPTY_PROGRESS)?.id).toBe('welcome');
    useTourStore.getState().setTours(listed ? [listed] : []);
    expect(tours.start('welcome')).toBe(true);
    await flush();
    expect(loads).toBe(1);
    expect(useTourStore.getState().active).toEqual({ id: 'welcome', index: 0 });
    expect(tours.list()[0]?.steps.length).toBe(2);
    useTourStore.getState().setTours(listed ? [listed] : []);
    expect(tours.list()[0]?.steps.length).toBe(2);
  });
});
