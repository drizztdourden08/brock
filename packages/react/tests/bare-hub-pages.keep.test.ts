/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { expandLive } from '../src/hub/Hub/behavior/expand-live';
import { drawsPageHeader } from '../src/hub/Hub/behavior/draws-page-header';
import { isBarePage } from '../src/hub/Hub/behavior/is-bare-page';
import type { HubPage } from '../src/hub/hub.type';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { ScreenEntry } from '../src/screens/conventions/screen-tree.type';
import type { BucketDef, ScreenMeta } from '../src/screens/conventions/screens-config.type';

const Panel = () => null;

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

describe('K1 bare hub pages', { tags: ['critical'] }, () => {
  it('is never bare for a page with tabs, a sub page or a settings tab', () => {
    const base: HubPage = { id: 'x', label: 'X', icon: null, render: () => null, bare: true };
    expect(isBarePage({}, base)).toBe(true);
    expect(isBarePage({}, { ...base, tabs: [{ id: 'a', label: 'A', render: () => null }] })).toBe(false);
    expect(isBarePage({}, { ...base, settingsTab: 'tools/x' })).toBe(false);
    expect(isBarePage({}, base, { id: 's', label: 'S', icon: null, path: 's', render: () => null })).toBe(false);
  });

  it('lets a page opt back in with bare: false in a hub that makes its pages bare', () => {
    const bare: BucketDef = { ...BUCKET, pages: 'bare' };
    const list = entries({ bare: false });
    expect(pageOf(bare, list, 'editor').bare).toBe(false);
    expect(isBarePage(treeFor(bare, list), pageOf(bare, list, 'editor'))).toBe(false);
    expect(isBarePage(treeFor(bare, list), pageOf(bare, list, 'notes'))).toBe(true);
  });

  it('says which pages draw a page header, for the review', () => {
    const list = entries({ showHeader: true }, { bare: true });
    const hub = treeFor(BUCKET, list);
    expect(drawsPageHeader(hub, pageOf(BUCKET, list, 'editor'))).toBe(true);
    expect(drawsPageHeader(hub, pageOf(BUCKET, list, 'notes'))).toBe(false);
    expect(drawsPageHeader(hub, hub.home)).toBe(false);
  });

  describe('a live page', () => {
    const usePages = () => [];
    const holder = (meta: ScreenMeta): HubPage => ({ id: 'pads', label: 'Pads', icon: null, render: () => null, live: { usePages, meta: { icon: 'gamepad-2', empty: 'None', ...meta } } });
    const item = { key: 'a', title: 'Pad a', render: () => null };

    it('takes bare and showHeader from the slot meta, and an entry can override them', () => {
      expect(expandLive(holder({ bare: true, showHeader: true }), [item])[0]).toMatchObject({ bare: true, showHeader: true });
      expect(expandLive(holder({ bare: true }), [{ ...item, bare: false }])[0]).toMatchObject({ bare: false });
    });

    it('takes the compact header from the slot meta', () => {
      expect(expandLive(holder({ showHeader: 'compact' }), [item])[0]).toMatchObject({ showHeader: 'compact' });
    });
  });
});
