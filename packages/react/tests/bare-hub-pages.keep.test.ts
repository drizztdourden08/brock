/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Hub } from '../src/hub/Hub';
import { expandLive } from '../src/hub/Hub/behavior/expand-live';
import { drawsPageHeader } from '../src/hub/Hub/behavior/draws-page-header';
import { isBarePage } from '../src/hub/Hub/behavior/is-bare-page';
import type { HubPage } from '../src/hub/hub.type';
import { defineWindow } from '../src/screens/window/define-window';
import { NO_PARAMS } from '../src/navigation/navigation.constants';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { BucketDef, ScreenMeta } from '../src/screens/conventions/screens-config.type';
import { showHarness } from './show-harness';

const Panel = () => createElement('p', { className: 'own-panel' }, 'own panel');

const BUCKET: BucketDef = { id: 'tools', title: 'Tools', icon: 'wrench', menu: 'entry' };

const entries = (meta: ScreenMeta | undefined, other?: ScreenMeta): ScreenEntry[] => [
  { kind: 'hero', bucket: 'tools', id: 'home', component: Panel },
  { kind: 'page', bucket: 'tools', id: 'editor', component: Panel, meta },
  { kind: 'page', bucket: 'tools', id: 'notes', component: Panel, meta: other },
];

const treeFor = (bucket: BucketDef, list: ScreenEntry[]) => {
  const hub = buildScreenTree({ buckets: [bucket], home: 'tools' }, list).hubs[0];
  if (!hub) throw new Error('no hub');
  return hub;
};

const pageOf = (bucket: BucketDef, list: ScreenEntry[], id: string): HubPage => {
  const page = treeFor(bucket, list).groups.flatMap((group) => group.pages).find((candidate) => candidate.id === id);
  if (!page) throw new Error(`no page ${id}`);
  return page;
};

const draw = (bucket: BucketDef, list: ScreenEntry[], section: string): void => {
  const ctx = { params: { ...NO_PARAMS, section }, profile: null, close: () => undefined, open: () => undefined };
  showHarness.render(createElement(PlatformProvider, null, createElement(Hub, { def: treeFor(bucket, list), ctx })));
};

const wrappers = (): number => document.querySelectorAll('.screen-page, .page-card, .screen-page__body, .content-header').length;

afterEach(() => showHarness.resetShow());

describe('a bare page', () => {
  it('renders the component straight into the content slot, with no card, padding, header or scroll wrapper', () => {
    draw(BUCKET, entries({ bare: true }), 'editor');
    const region = document.querySelector('section[aria-label="Editor"]');
    expect(region?.classList.contains('hub-bare-page')).toBe(true);
    expect(region?.querySelector('.own-panel')).not.toBeNull();
    expect(wrappers()).toBe(0);
    expect(document.querySelector('.side-nav-layout__pane')?.classList.contains('scroll-area')).toBe(false);
    expect(document.querySelector('.side-nav-layout__pane .scroll-area')).toBeNull();
  });

  it('keeps an accessible name from the page title', () => {
    draw(BUCKET, entries({ bare: true, title: 'Level editor' }), 'editor');
    expect(document.querySelector('section[aria-label="Level editor"] .own-panel')).not.toBeNull();
  });

  it('leaves a page without the flag in the card, as before', () => {
    draw(BUCKET, entries(undefined), 'editor');
    expect(document.querySelector('.page-card .own-panel')).not.toBeNull();
    expect(document.querySelector('.hub-bare-page')).toBeNull();
  });

  it('is never bare for a page with tabs, a sub page or a settings tab', () => {
    const base: HubPage = { id: 'x', label: 'X', icon: null, render: () => null, bare: true };
    expect(isBarePage({}, base)).toBe(true);
    expect(isBarePage({}, { ...base, tabs: [{ id: 'a', label: 'A', render: () => null }] })).toBe(false);
    expect(isBarePage({}, { ...base, settingsTab: 'tools/x' })).toBe(false);
    expect(isBarePage({}, base, { id: 's', label: 'S', icon: null, path: 's', render: () => null })).toBe(false);
  });
});

describe('a hub that makes its pages bare', () => {
  const bare: BucketDef = { ...BUCKET, pages: 'bare' };

  it('draws every page bare', () => {
    draw(bare, entries(undefined), 'notes');
    expect(document.querySelector('section.hub-bare-page[aria-label="Notes"] .own-panel')).not.toBeNull();
    expect(wrappers()).toBe(0);
  });

  it('lets a page opt back in with bare: false', () => {
    const list = entries({ bare: false });
    expect(pageOf(bare, list, 'editor').bare).toBe(false);
    expect(isBarePage(treeFor(bare, list), pageOf(bare, list, 'editor'))).toBe(false);
    expect(isBarePage(treeFor(bare, list), pageOf(bare, list, 'notes'))).toBe(true);
    draw(bare, list, 'editor');
    expect(document.querySelector('.page-card .own-panel')).not.toBeNull();
  });

  it('leaves the hero home unchanged', () => {
    draw(bare, entries(undefined), 'home');
    expect(document.querySelector('.hub-bare-page')).toBeNull();
  });
});

describe('the page header of a hub page', () => {
  it('is off by default: the card holds the body and is named by the page title', () => {
    draw(BUCKET, entries(undefined), 'editor');
    expect(document.querySelector('.content-header')).toBeNull();
    expect(document.querySelector('.page-card.screen-page[aria-label="Editor"] .screen-page__body .own-panel')).not.toBeNull();
  });

  it('comes back with showHeader: true', () => {
    draw(BUCKET, entries({ showHeader: true }), 'editor');
    expect(document.querySelector('.content-header')).not.toBeNull();
    expect(document.querySelector('.screen-page__body .own-panel')).not.toBeNull();
  });

  it('stays for a page that declares header actions, unless showHeader is false', () => {
    const header = { search: { placeholder: 'Find' } };
    draw(BUCKET, entries({ header }), 'editor');
    expect(document.querySelector('.content-header')).not.toBeNull();
    showHarness.resetShow();
    draw(BUCKET, entries({ header, showHeader: false }), 'editor');
    expect(document.querySelector('.content-header')).toBeNull();
  });

  it('says which pages draw one, for the review', () => {
    const list = entries({ showHeader: true }, { bare: true });
    const hub = treeFor(BUCKET, list);
    expect(drawsPageHeader(hub, pageOf(BUCKET, list, 'editor'))).toBe(true);
    expect(drawsPageHeader(hub, pageOf(BUCKET, list, 'notes'))).toBe(false);
    expect(drawsPageHeader(hub, hub.home)).toBe(false);
  });
});

describe('a live page', () => {
  const usePages = () => [];
  const holder = (meta: ScreenMeta): HubPage => ({ id: 'pads', label: 'Pads', icon: null, render: () => null, live: { usePages, meta: { icon: 'gamepad-2', empty: 'None', ...meta } } });
  const item = { key: 'a', title: 'Pad a', render: () => null };

  it('takes bare and showHeader from the slot meta, and an entry can override them', () => {
    expect(expandLive(holder({ bare: true, showHeader: true }), [item])[0]).toMatchObject({ bare: true, showHeader: true });
    expect(expandLive(holder({ bare: true }), [{ ...item, bare: false }])[0]).toMatchObject({ bare: false });
  });

  it('draws bare in the content slot', () => {
    const list: ScreenEntry[] = [
      { kind: 'hero', bucket: 'tools', id: 'home', component: Panel },
      { kind: 'live', bucket: 'tools', id: 'pads', usePages: () => [{ key: 'a', title: 'Pad a', render: () => createElement(Panel) }], meta: { icon: 'gamepad-2', empty: 'None', bare: true } },
    ];
    draw(BUCKET, list, 'pads');
    expect(document.querySelector('section.hub-bare-page[aria-label="Pad a"] .own-panel')).not.toBeNull();
    expect(wrappers()).toBe(0);
  });
});

describe('a window item', () => {
  const Window = defineWindow({ items: [{ id: 'one', label: 'One', icon: 'house', bare: true, render: () => createElement(Panel) }] });

  it('drops the pane scroll wrapper when bare', () => {
    showHarness.render(createElement(Window, { params: NO_PARAMS, profile: null, close: () => undefined, open: () => undefined }));
    expect(document.querySelector('.side-nav-layout__pane .own-panel')).not.toBeNull();
    expect(document.querySelector('.side-nav-layout__pane')?.classList.contains('scroll-area')).toBe(false);
  });
});
