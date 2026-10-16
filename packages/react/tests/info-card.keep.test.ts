/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createCreditsScreen } from '../src/screens/built-in/create-credits-screen';
import { cardScreen } from '../src/screens/conventions/card-screen';
import { ScreenLayer } from '../src/screens/ScreenLayer/ScreenLayer';

const View = () => null;
const noop = (): void => undefined;

const layer = (size?: 'info') => renderToStaticMarkup(createElement(ScreenLayer, { title: 'Credits', icon: null, header: size ? 'none' : 'page', size, onClose: noop, children: 'Thanks' }));

describe('an informational card', () => {
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

  it('opens the built-in Credits screen small', () => {
    const screen = createCreditsScreen('Thanks');
    expect(screen.size).toBe('info');
    expect(screen.header).toBe('none');
  });

  it('draws the window at size info with the content in its own scroll area', () => {
    const html = layer('info');
    expect(html).toContain('screen-layer--info');
    expect(html).toContain('brock-info-card');
    expect(html).not.toContain('screen-page');
  });

  it('draws a card without it as before', () => {
    const html = layer();
    expect(html).not.toContain('screen-layer--info');
    expect(html).toContain('screen-page');
  });
});
