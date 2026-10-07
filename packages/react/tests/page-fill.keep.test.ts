/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { HubPageFrame } from '../src/hub/Hub/sub-components/HubPageFrame';
import type { HubPage, HubSubPage } from '../src/hub/hub.type';

const PAGE: HubPage = { id: 'presets', label: 'Presets', icon: null, render: () => null };
const SUB: HubSubPage = { id: 'edit', label: 'Edit preset', icon: null, path: 'edit', render: () => null };

const roots: Root[] = [];

const frame = (page: HubPage, sub: HubSubPage | null = null): Element | null => {
  document.body.innerHTML = '<div id="host"></div>';
  const root = createRoot(document.getElementById('host') as HTMLElement);
  roots.push(root);
  const noop = (): void => undefined;
  act(() => root.render(createElement(HubPageFrame, { page, tab: null, sub, route: 'data/presets', onSelectTab: noop, onUp: noop, children: 'Body' })));
  return document.querySelector('.screen-page__body');
};

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.replaceChildren();
});

describe('a page with fill', () => {
  it('draws its body at the window height, without a scroll of its own, so its panes scroll', () => {
    expect(frame({ ...PAGE, fill: true })?.classList.contains('screen-page__body--fixed')).toBe(true);
    expect(frame({ ...PAGE, fill: true, tabs: [{ id: 'list', label: 'List', render: () => null }] })?.classList.contains('screen-page__body--fixed')).toBe(true);
    expect(frame(PAGE, { ...SUB, fill: true })?.classList.contains('screen-page__body--fixed')).toBe(true);
  });

  it('leaves a page without it scrolling as before', () => {
    expect(frame(PAGE)?.classList.contains('screen-page__body--fixed')).toBe(false);
    expect(frame({ ...PAGE, fill: true }, SUB)?.classList.contains('screen-page__body--fixed')).toBe(false);
  });
});
