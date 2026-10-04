/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
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
    const html = renderToStaticMarkup(createElement(ScreenLayer, { title: 'Multiworld', icon: null, onBack: noop, onClose: noop, header: 'none', children: 'body' }));
    expect(html).toContain('window-header__back');
    expect(dialogName(html)).toBe('Multiworld');
  });
});
