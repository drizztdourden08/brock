/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement, useContext } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { HubPageSlot } from '../src/hub/Hub/sub-components/HubPageSlot';
import type { HubDef, HubPage, HubRenderContext } from '../src/hub/hub.type';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { PageBackdrop } from '../src/screens/conventions/screens-config.type';
import { SettingsPageContext } from '../src/settings/SettingsLayout/behavior/settings-page-context';
import { showHarness } from './show-harness';

const noop = (): void => undefined;
const page = (id: string, extra: Partial<HubPage> = {}): HubPage => ({ id, label: id, icon: null, showHeader: true, render: () => createElement('p', null, id), ...extra });

const draw = (hubBackdrop: PageBackdrop | undefined, shown: HubPage): HTMLElement => {
  const hub: HubDef = { id: 'library', title: 'Library', icon: null, home: shown, groups: [], backdrop: hubBackdrop };
  const context: HubRenderContext = { hub, page: shown, tab: null, sub: null, subParams: {}, params: {}, open: noop, close: noop, profile: null };
  return showHarness.render(createElement(HubPageSlot, { context, onSelectTab: noop, onUp: noop }));
};

const backdropOf = (host: HTMLElement): Element | null => host.querySelector('.content-header__backdrop');

afterEach(showHarness.resetShow);

describe('a hub header backdrop', () => {
  it('paints the hub colour or image behind every page header', () => {
    const host = draw({ kind: 'color', color: '--c-secondary' }, page('shelf'));
    expect((backdropOf(host)?.querySelector('.backdrop-layer--color') as HTMLElement | null)?.style.backgroundColor).toBe('var(--c-secondary)');
    draw({ kind: 'image', src: 'art/wall.png', fit: 'tile', tileSize: '64px', pixelated: true }, page('shelf'));
    const tile = backdropOf(host)?.querySelector('.backdrop-layer--image') as HTMLElement | null;
    expect(tile?.getAttribute('data-fit')).toBe('tile');
    expect(tile?.style.backgroundImage).toContain('art/wall.png');
    expect(tile?.classList.contains('backdrop-layer--pixelated')).toBe(true);
  });

  it('lets a page draw its own node or none, and keeps the default art without one', () => {
    const host = draw({ kind: 'color', color: 'red' }, page('shelf', { backdrop: { kind: 'node', node: createElement('i', { className: 'own-art' }) } }));
    expect(backdropOf(host)?.querySelector('.backdrop-layer--node > .own-art')).not.toBeNull();
    draw({ kind: 'color', color: 'red' }, page('shelf', { backdrop: { kind: 'none' } }));
    expect(backdropOf(host)).toBeNull();
    draw(undefined, page('shelf'));
    expect(backdropOf(host)?.querySelector('.backdrop-layer')).toBeNull();
    expect(backdropOf(host)).not.toBeNull();
  });

  it('hands the backdrop to a settings page through its context', () => {
    const Reader = () => {
      const value = useContext(SettingsPageContext);
      return createElement('output', null, value?.backdrop === undefined ? 'none' : 'backdrop');
    };
    const host = draw({ kind: 'color', color: 'red' }, page('general', { settingsTab: 'general', render: () => createElement(Reader) }));
    expect(host.textContent).toBe('backdrop');
  });

  it('takes backdrop from a bucket and from a page meta', () => {
    const View = () => null;
    const tree = buildScreenTree(
      { buckets: [{ id: 'library', title: 'Library', icon: 'house', menu: 'entry', backdrop: { kind: 'color', color: 'navy' } }], home: 'library' },
      [{ kind: 'page', bucket: 'library', id: 'shelf', component: View }, { kind: 'page', bucket: 'library', id: 'wall', component: View, meta: { backdrop: { kind: 'none' } } }],
    );
    const [hub] = tree.hubs;
    expect(hub?.backdrop).toEqual({ kind: 'color', color: 'navy' });
    expect(hub?.groups[0]?.pages.find((entry) => entry.id === 'wall')?.backdrop).toEqual({ kind: 'none' });
  });
});
