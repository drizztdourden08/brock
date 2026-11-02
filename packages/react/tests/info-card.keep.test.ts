/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { cardScreen } from '../src/screens/conventions/card-screen';

const View = () => null;

describe('K1 an informational card', { tags: ['critical'] }, () => {
  it('takes size info and no page header from meta.size', () => {
    const screen = cardScreen({ kind: 'card', id: 'credits', component: View, meta: { size: 'info' } });
    expect(screen.size).toBe('info');
    expect(screen.header).toBe('none');
    expect(screen.layer).toBe('fullscreen');
  });

  it('leaves a card without it filling the window under its page header', () => {
    const screen = cardScreen({ kind: 'card', id: 'changelog', component: View });
    expect(screen.size).toBeUndefined();
    expect(screen.header).toBe('page');
  });

  it('ignores it on a layer', () => {
    expect(cardScreen({ kind: 'layer', id: 'overlay', component: View, meta: { size: 'info' } }).size).toBeUndefined();
  });
});
