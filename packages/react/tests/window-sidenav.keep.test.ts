/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScreenLayer } from '../src/screens/ScreenLayer/ScreenLayer';
import { cardScreen } from '../src/screens/conventions/card-screen';
import { activeItem } from '../src/screens/window/SideNavWindow/behavior/active-item';
import { windowNavConfig } from '../src/screens/window/SideNavWindow/behavior/window-nav-config';
import { assertWindow } from '../src/screens/window/assert-window';
import { defineWindow } from '../src/screens/window/define-window';
import type { WindowDef } from '../src/screens/window/window.type';

const noop = (): void => undefined;
const View = () => null;

const def: WindowDef = {
  groups: [
    { id: 'records', label: 'Records', items: [
      { id: 'items', label: 'Items', icon: 'package', render: () => createElement('p', null, 'items pane') },
      { id: 'maps', label: 'Maps', icon: 'map', render: () => createElement('p', null, 'maps pane') },
    ] },
    { id: 'review', items: [{ id: 'notes', label: 'Notes', icon: 'file', disabled: true, render: () => null }] },
  ],
};

const ctx = { params: {}, profile: null, open: noop, close: noop };
const html = (window: WindowDef, params: Record<string, unknown> = {}) =>
  renderToStaticMarkup(createElement(defineWindow(window), { ...ctx, params }));

describe('a window with a sidenav', () => {
  it('lists the nav items in their groups and shows the first item', () => {
    const markup = html(def);
    expect(markup).toContain('Records');
    expect(markup).toContain('Maps');
    expect(markup).toContain('items pane');
    expect(markup).not.toContain('maps pane');
  });

  it('opens the item named by the nav route param, then initial, then the first enabled item', () => {
    expect(html(def, { nav: 'maps' })).toContain('maps pane');
    expect(html({ ...def, initial: 'maps' })).toContain('maps pane');
    expect(html(def, { nav: 'missing' })).toContain('items pane');
    expect(activeItem(def, 'notes').id).toBe('items');
  });

  it('takes a flat items list as one unlabeled group', () => {
    const flat: WindowDef = { items: def.groups?.[0]?.items };
    expect(windowNavConfig(flat).groups).toHaveLength(1);
    expect(windowNavConfig(flat).groups[0]?.label).toBeUndefined();
  });

  it('passes an item badge to the side nav', () => {
    const badged: WindowDef = { items: [{ id: 'a', label: 'A', icon: 'package', badge: 3, render: () => null }] };
    expect(windowNavConfig(badged).groups[0]?.items[0]?.badge).toBe(3);
  });

  it('refuses a window that cannot work', () => {
    expect(() => assertWindow({})).toThrow('no nav items');
    expect(() => assertWindow({ items: [...(def.groups?.[0]?.items ?? []), ...(def.groups?.[0]?.items ?? [])] })).toThrow('declared twice');
    expect(() => assertWindow({ ...def, initial: 'nope' })).toThrow('not a nav item');
  });
});

describe('a card with meta.fill', () => {
  it('draws its own body: header fill, no page wrapper', () => {
    expect(cardScreen({ kind: 'card', id: 'library', component: View, meta: { fill: true } }).header).toBe('fill');
    expect(cardScreen({ kind: 'layer', id: 'library', component: View, meta: { fill: true } }).header).toBe('fill');
  });

  it('leaves a card without it, and an info card, as they were', () => {
    expect(cardScreen({ kind: 'card', id: 'library', component: View }).header).toBe('page');
    expect(cardScreen({ kind: 'card', id: 'credits', component: View, meta: { fill: true, size: 'info' } }).header).toBe('none');
  });
});

describe('the fill header', () => {
  const layer = (header: 'page' | 'fill') => renderToStaticMarkup(createElement(ScreenLayer, { title: 'Library', icon: null, header, onClose: noop, children: createElement('p', null, 'body') }));

  it('draws the window header like a page, and the body without the page wrapper', () => {
    expect(layer('fill')).toContain('screen-window--header');
    expect(layer('fill')).not.toContain('brock-page-body');
    expect(layer('page')).toContain('brock-page-body');
  });
});
