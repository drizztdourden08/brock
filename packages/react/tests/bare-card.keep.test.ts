/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defineHub } from '../src/hub/define-hub';
import { HUB_WINDOW_KEY } from '../src/hub/hub.constants';
import { cardScreen } from '../src/screens/conventions/card-screen';
import type { ScreenDef } from '../src/screens/screen.type';
import { freeFrameOf } from '../src/screens/ScreenHost/behavior/free-frame-of';
import { isHubWindow } from '../src/screens/ScreenHost/behavior/is-hub-window';
import { layerKeyOf } from '../src/screens/ScreenHost/behavior/layer-key-of';
import { ScreenLayer } from '../src/screens/ScreenLayer/ScreenLayer';

const View = () => null;
const noop = (): void => undefined;

const html = (screen: ScreenDef): string => {
  const free = isHubWindow(screen) ? freeFrameOf(screen) : {};
  return renderToStaticMarkup(createElement(ScreenLayer, { title: screen.title, icon: screen.icon, header: screen.header, onClose: noop, children: 'body', ...free }));
};

const drawn = (bare: boolean) => html(cardScreen({ kind: 'card', id: 'game', component: View, meta: { fill: true, bare } }));

describe('a bare card', () => {
  it('takes the hub window: no page header, the shared hub storage key', () => {
    const screen = cardScreen({ kind: 'card', id: 'game', component: View, meta: { bare: true } });
    expect(screen.bare).toBe(true);
    expect(screen.header).toBe('own');
    expect(isHubWindow(screen)).toBe(true);
    expect(layerKeyOf(screen)).toBe(HUB_WINDOW_KEY);
  });

  it('wins over fill and size info', () => {
    const screen = cardScreen({ kind: 'card', id: 'game', component: View, meta: { bare: true, fill: true, size: 'info' } });
    expect(screen.header).toBe('own');
    expect(screen.size).toBeUndefined();
  });

  it('draws no title row, where a fill card draws one', () => {
    expect(drawn(false)).toContain('screen-window--header');
    expect(drawn(true)).not.toContain('screen-window--header');
  });

  it('names the window with a corner title chip and its icon', () => {
    const card = html(cardScreen({ kind: 'card', id: 'game', component: View, meta: { bare: true, icon: 'gear' } }));
    expect(card).toContain('screen-window__corner-title');
    expect(card).toContain('screen-window__corner-icon');
    expect(card).toContain('>Game<');
  });

  it('leaves a hub without the chip, as its floating switch names it', () => {
    const page = { id: 'home', label: 'Home', icon: null, render: () => null };
    const hub = defineHub({ id: 'game', title: 'Game', icon: null, home: page, groups: [] });
    expect(isHubWindow(hub)).toBe(true);
    expect(html(hub)).not.toContain('screen-window__corner-title');
  });

  it('leaves a card without it, and a layer, unchanged', () => {
    const plain = cardScreen({ kind: 'card', id: 'notes', component: View });
    expect(plain.bare).toBeUndefined();
    expect(layerKeyOf(plain)).toBe('notes');
    expect(cardScreen({ kind: 'layer', id: 'overlay', component: View, meta: { bare: true } }).bare).toBeUndefined();
  });
});
