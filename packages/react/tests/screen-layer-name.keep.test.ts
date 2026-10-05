/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { backLabelOf } from '../src/hub/back-label-of';
import { defineHub } from '../src/hub/define-hub';
import { navigationSteps } from '../src/navigation/navigation-steps';
import { EMPTY_NAVIGATION } from '../src/navigation/navigation.constants';
import { defineScreen } from '../src/screens/define-screen';
import { ScreenLayer } from '../src/screens/ScreenLayer/ScreenLayer';

const noop = (): void => undefined;

const textOf = (html: string, id: string): string | null => {
  const at = html.indexOf(`id="${id}"`);
  if (at === -1) return null;
  const open = html.lastIndexOf('<', at);
  const tag = /^<(\w+)/.exec(html.slice(open))?.[1] ?? '';
  const end = html.indexOf(`</${tag}>`, at);
  return html.slice(html.indexOf('>', at) + 1, end).replace(/<[^>]+>/g, '').trim();
};

const dialogName = (html: string): string | null => {
  const dialog = /<[^>]*role="dialog"[^>]*>/.exec(html)?.[0] ?? '';
  const labelId = /aria-labelledby="([^"]+)"/.exec(dialog)?.[1];
  return labelId ? textOf(html, labelId) : null;
};

describe('ScreenLayer', () => {
  it('names its dialog by the title alone, with Back outside the labelling heading', () => {
    const html = renderToStaticMarkup(createElement(ScreenLayer, { title: 'Multiworld', icon: null, back: { onSelect: noop }, onClose: noop, header: 'none', children: 'body' }));
    expect(html).toContain('window-header__back');
    expect(dialogName(html)).toBe('Multiworld');
  });

  it('reads Back to and the page it goes back to', () => {
    const html = renderToStaticMarkup(createElement(ScreenLayer, { title: 'Game', icon: null, back: { onSelect: noop, label: 'Saves' }, onClose: noop, header: 'none', children: 'body' }));
    expect(html).toContain('Back to Saves');
  });
});

describe('the way back', () => {
  const page = (id: string, label: string) => ({ id, label, icon: null, render: () => null });
  const hub = defineHub({ id: 'game', title: 'Game', icon: null, home: page('home', 'Overview'), groups: [{ id: 'play', label: 'Play', pages: [page('saves', 'Saves')] }] });

  it('names the hub page the history goes back to, and the screen title elsewhere', () => {
    expect(backLabelOf(hub, { section: 'saves' })).toBe('Saves');
    expect(backLabelOf(hub, {})).toBe('Overview');
    expect(backLabelOf(defineScreen({ id: 'tools', title: 'Tools', icon: null, render: () => null }), {})).toBe('Tools');
  });

  it('goes back to the last page of the trail, else the parent, else nowhere', () => {
    const saves = { section: 'saves' };
    expect(navigationSteps.backTarget({ ...EMPTY_NAVIGATION, active: 'game', history: { game: [{}, saves] } })).toBe(saves);
    expect(navigationSteps.backTarget({ ...EMPTY_NAVIGATION, active: 'game', parent: saves })).toBe(saves);
    expect(navigationSteps.backTarget({ ...EMPTY_NAVIGATION, active: 'game' })).toBeNull();
    expect(navigationSteps.backTarget(EMPTY_NAVIGATION)).toBeNull();
  });
});
