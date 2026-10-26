/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AppBackground } from '../src/app/BrockApp/sub-components/AppBackground';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

const CSS = read('../src/app/BrockApp/BrockApp.css');
const SHELL = read('../src/app/BrockApp/sub-components/AppShell/AppShell.tsx');

const rule = (selector: string) => CSS.slice(CSS.indexOf(`${selector} {`), CSS.indexOf('}', CSS.indexOf(`${selector} {`)));

describe('app background slot', () => {
  it('draws the node in its own hidden layer and nothing when none is given', () => {
    const html = renderToStaticMarkup(createElement(AppBackground, null, createElement('i', { id: 'surround' })));
    expect(html).toContain('brock-app__background');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('id="surround"');
    expect(renderToStaticMarkup(createElement(AppBackground))).toBe('');
  });

  it('sits behind everything in the content area and lets pointer events through', () => {
    const layer = rule('.brock-app__background');
    expect(layer).toContain('position: absolute');
    expect(layer).toContain('inset: 0');
    expect(layer).toContain('z-index: -1');
    expect(layer).toContain('pointer-events: none');
    expect(rule('.brock-app__content')).toContain('isolation: isolate');
  });

  it('is mounted before the rail and the widget host stage', () => {
    expect(SHELL.indexOf('<AppBackground>')).toBeGreaterThan(SHELL.indexOf('brock-app__content'));
    expect(SHELL.indexOf('<AppBackground>')).toBeLessThan(SHELL.indexOf('<AppRail'));
    expect(SHELL.indexOf('<AppBackground>')).toBeLessThan(SHELL.indexOf('{stage}'));
  });
});
