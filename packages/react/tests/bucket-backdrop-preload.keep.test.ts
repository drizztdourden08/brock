/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { defineHub } from '../src/hub/define-hub';
import type { HubDef } from '../src/hub/hub.type';
import { lazyComponent } from '../src/lazy/lazy-component';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';

const View = () => null;
const lazyView = () => lazyComponent(() => Promise.resolve({ default: View }));

const libraryHub = (art: ScreenEntry[]): HubDef => {
  const tree = buildScreenTree({ buckets: [{ id: 'library', title: 'Library', icon: 'house', menu: 'entry' }], home: 'library' }, [
    { kind: 'hero', bucket: 'library', id: 'home', component: lazyView() },
    { kind: 'page', bucket: 'library', id: 'shelf', component: lazyView() },
    { kind: 'sub', bucket: 'library', page: 'shelf', id: 'edit', component: lazyView() },
    { kind: 'tab', bucket: 'library', page: 'tracker', id: 'items', component: lazyView() },
    ...art,
  ]);
  const [hub] = tree.hubs;
  if (hub === undefined) throw new Error('no hub');
  return hub;
};

const pageOf = (hub: HubDef, id: string) => {
  const page = hub.groups.flatMap((group) => group.pages).find((candidate) => candidate.id === id);
  if (page === undefined) throw new Error(`no page ${id}`);
  return page;
};

type Pick = (hub: HubDef) => (() => Promise<unknown>) | undefined;

const PRELOADS: [string, Pick][] = [
  ['the hub screen (a bucket pill, the boot preload)', (hub) => defineHub(hub).preload],
  ['the hub home', (hub) => hub.home.preload],
  ['a page (a menu row or a nav entry)', (hub) => pageOf(hub, 'shelf').preload],
  ['a tab', (hub) => pageOf(hub, 'tracker').tabs?.[0]?.preload],
  ['a sub-page', (hub) => pageOf(hub, 'shelf').subs?.[0]?.preload],
];

describe('a bucket backdrop file preloads with its bucket', () => {
  it.each(PRELOADS)('loads with %s', async (_where, pick) => {
    const art = lazyComponent(() => Promise.resolve({ default: View }));
    const preload = pick(libraryHub([{ kind: 'backdrop', bucket: 'library', id: 'library', component: art }]));
    expect(art.loaded).toBe(false);
    await preload?.();
    expect(art.loaded).toBe(true);
  });

  it('keeps the page loads as they were without a backdrop file', async () => {
    const hub = libraryHub([]);
    expect(hub.backdrop).toBeUndefined();
    await expect(pageOf(hub, 'shelf').preload?.()).resolves.toBe(View);
  });
});
