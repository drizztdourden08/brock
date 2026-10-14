/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useKeptPages } from '../src/hub/Hub/behavior/useKeptPages';
import { HubPageSlot } from '../src/hub/Hub/sub-components/HubPageSlot';
import type { HubDef, HubPage, HubRenderContext } from '../src/hub/hub.type';

const mounts: string[] = [];

const Counted = (props: { name: string }) => {
  useEffect(() => {
    mounts.push(`mount ${props.name}`);
    return () => { mounts.push(`unmount ${props.name}`); };
  }, [props.name]);
  return createElement('p', null, props.name);
};

const page = (id: string, keepMounted = false): HubPage => ({ id, label: id, icon: null, keepMounted, fullBleed: true, render: () => createElement(Counted, { name: id }) });

const GAME = page('game', true);
const SAVES = page('saves');
const HUB: HubDef = { id: 'play', title: 'Play', icon: null, home: GAME, groups: [{ id: 'play', label: 'Play', pages: [SAVES] }] };

const contextOf = (shown: HubPage): HubRenderContext => ({ hub: HUB, page: shown, tab: null, sub: null, subParams: {}, params: {}, open: () => undefined, close: () => undefined, profile: null });

const noop = (): void => undefined;

const Pages = (props: { page: HubPage; context: HubRenderContext }) => {
  const kept = useKeptPages(props.page, props.context);
  return createElement(
    'div',
    null,
    props.page.keepMounted === true ? null : createElement(HubPageSlot, { context: props.context, onSelectTab: noop, onUp: noop }),
    ...kept.map((entry) => createElement(Box, { key: `kept:${entry.id}`, hidden: !entry.shown, className: `kept-${entry.id}` }, createElement(HubPageSlot, { context: entry.context, onSelectTab: noop, onUp: noop }))),
  );
};

let root: Root | null = null;

const show = (shown: HubPage): void => {
  act(() => root?.render(createElement(Pages, { page: shown, context: contextOf(shown) })));
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  mounts.length = 0;
  document.body.replaceChildren();
});

describe('a hub page with keepMounted', () => {
  it('stays mounted, hidden, while another page of the hub is open, and shows again as it was', () => {
    document.body.innerHTML = '<div id="host"></div>';
    root = createRoot(document.getElementById('host') as HTMLElement);
    show(GAME);
    show(SAVES);
    expect(document.querySelector('.kept-game')?.hasAttribute('hidden')).toBe(true);
    show(GAME);
    show(SAVES);
    expect(mounts).toEqual(['mount game', 'mount saves', 'unmount saves', 'mount saves']);
    expect(document.querySelector('.kept-game')?.textContent).toBe('game');
  });
});
