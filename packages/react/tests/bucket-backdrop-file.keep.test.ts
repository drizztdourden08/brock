/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { HubPageSlot } from '../src/hub/Hub/sub-components/HubPageSlot';
import type { HubDef, HubPage, HubRenderContext } from '../src/hub/hub.type';
import { lazyComponent } from '../src/lazy/lazy-component';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { ScreensConfig } from '../src/screens/conventions/screens-config.type';
import { showHarness } from './show-harness';

const noop = (): void => undefined;
const View = () => null;
const Art = () => createElement('i', { className: 'library-art' });

const config = (backdrop?: ScreensConfig['buckets'][number]['backdrop']): ScreensConfig => ({
  buckets: [{ id: 'library', title: 'Library', icon: 'house', menu: 'entry', ...(backdrop ? { backdrop } : {}) }],
  home: 'library',
});

const entries = (art: ScreenEntry[] = []): ScreenEntry[] => [
  { kind: 'page', bucket: 'library', id: 'shelf', component: View },
  { kind: 'page', bucket: 'library', id: 'wall', component: View, meta: { backdrop: { kind: 'color', color: 'navy' } } },
  ...art,
];

const draw = (hub: HubDef, page: HubPage): HTMLElement => {
  const context: HubRenderContext = { hub, page, tab: null, sub: null, subParams: {}, params: {}, open: noop, close: noop, profile: null };
  return showHarness.render(createElement(HubPageSlot, { context, onSelectTab: noop, onUp: noop }));
};

const pagesOf = (hub: HubDef): HubPage[] => [hub.home, ...hub.groups.flatMap((group) => group.pages)];

afterEach(showHarness.resetShow);

describe('a bucket backdrop file', () => {
  it('draws the file component as the bucket backdrop once it loads', async () => {
    const backdrop = lazyComponent(() => Promise.resolve({ default: Art }));
    const [hub] = buildScreenTree(config(), entries([{ kind: 'backdrop', bucket: 'library', id: 'library', component: backdrop }])).hubs;
    if (hub === undefined) throw new Error('no hub');
    expect(hub.backdrop?.kind).toBe('node');
    const shelf = pagesOf(hub).find((page) => page.id === 'shelf');
    if (shelf === undefined) throw new Error('no shelf page');
    const host = draw(hub, shelf);
    expect(host.querySelector('.content-header__backdrop')).not.toBeNull();
    expect(host.querySelector('.library-art')).toBeNull();
    await act(async () => { await backdrop.preload(); });
    draw(hub, shelf);
    expect(host.querySelector('.content-header__backdrop .backdrop-layer--node .library-art')).not.toBeNull();
  });

  it('gives way to a page meta backdrop', () => {
    const [hub] = buildScreenTree(config(), entries([{ kind: 'backdrop', bucket: 'library', id: 'library', component: Art }])).hubs;
    if (hub === undefined) throw new Error('no hub');
    const wall = pagesOf(hub).find((page) => page.id === 'wall');
    if (wall === undefined) throw new Error('no wall page');
    const host = draw(hub, wall);
    expect(host.querySelector('.library-art')).toBeNull();
    expect(host.querySelector<HTMLElement>('.backdrop-layer--color')?.style.backgroundColor).toBe('navy');
  });

  it('wins over the screens.config backdrop, which stays the backdrop without a file', () => {
    const color = { kind: 'color', color: 'teal' } as const;
    expect(buildScreenTree(config(color), entries()).hubs[0]?.backdrop).toEqual(color);
    expect(buildScreenTree(config(color), entries([{ kind: 'backdrop', bucket: 'library', id: 'library', component: Art }])).hubs[0]?.backdrop?.kind).toBe('node');
  });
});
