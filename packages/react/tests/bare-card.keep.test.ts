/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { HUB_WINDOW_KEY } from '../src/hub/hub.constants';
import { cardScreen } from '../src/screens/conventions/card-screen';
import { isHubWindow } from '../src/screens/ScreenHost/behavior/is-hub-window';
import { layerKeyOf } from '../src/screens/ScreenHost/behavior/layer-key-of';

const View = () => null;

describe('K1 a bare card', { tags: ['critical'] }, () => {
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

  it('leaves a card without it, and a layer, unchanged', () => {
    const plain = cardScreen({ kind: 'card', id: 'notes', component: View });
    expect(plain.bare).toBeUndefined();
    expect(layerKeyOf(plain)).toBe('notes');
    expect(cardScreen({ kind: 'layer', id: 'overlay', component: View, meta: { bare: true } }).bare).toBeUndefined();
  });
});
