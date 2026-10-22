/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HUB_WINDOW_KEY } from '../src/hub/hub.constants';
import { cardScreen } from '../src/screens/conventions/card-screen';
import { isHubWindow } from '../src/screens/ScreenHost/behavior/is-hub-window';
import { layerKeyOf } from '../src/screens/ScreenHost/behavior/layer-key-of';
import { ScreenLayer } from '../src/screens/ScreenLayer/ScreenLayer';

const View = () => null;
const noop = (): void => undefined;

const drawn = (bare: boolean) => {
  const screen = cardScreen({ kind: 'card', id: 'game', component: View, meta: { fill: true, bare } });
  const free = isHubWindow(screen) ? { free: layerKeyOf(screen) } : {};
  return renderToStaticMarkup(createElement(ScreenLayer, { title: 'Game', icon: null, header: screen.header, onClose: noop, children: 'body', ...free }));
};

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

  it('leaves a card without it, and a layer, unchanged', () => {
    const plain = cardScreen({ kind: 'card', id: 'notes', component: View });
    expect(plain.bare).toBeUndefined();
    expect(layerKeyOf(plain)).toBe('notes');
    expect(cardScreen({ kind: 'layer', id: 'overlay', component: View, meta: { bare: true } }).bare).toBeUndefined();
  });
});
