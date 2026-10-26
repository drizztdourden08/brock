/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { defineContextMenu } from '../src/context-menu/define-context-menu';
import { listContextMenus } from '../src/context-menu/list-context-menus';
import { useContextMenu } from '../src/context-menu/useContextMenu';
import { useContextMenuStore } from '../src/context-menu/useContextMenuStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const Mounted = () => {
  useContextMenu('reg.mounted', ['reg.one']);
  return null;
};

const find = (zone: string) => listContextMenus().find((listed) => listed.zone === zone);

afterEach(() => {
  useContextMenuStore.setState({ menus: {}, known: {} });
});

describe('listing every registered menu', () => {
  it('lists a menu defined at module scope before any zone mounts, with its entries', () => {
    defineContextMenu('reg.static', ['reg.two', { label: 'Open', run: () => undefined }]);
    expect(find('reg.static')).toMatchObject({ mounted: false, commands: ['reg.two'], missing: ['reg.two'] });
    expect(find('reg.static')?.entries).toHaveLength(2);
  });

  it('accepts a builder and a config as the source', () => {
    defineContextMenu('reg.builder', () => ['reg.three']);
    defineContextMenu('reg.config', { entries: ['reg.four'], inherit: 'parent' });
    expect(find('reg.builder')?.commands).toEqual(['reg.three']);
    expect(find('reg.config')?.commands).toEqual(['reg.four']);
  });

  it('marks a menu mounted while its hook runs and keeps it listed, unmounted, afterwards', () => {
    const root = createRoot(document.createElement('div'));
    act(() => root.render(createElement(Mounted)));
    expect(find('reg.mounted')).toMatchObject({ mounted: true, commands: ['reg.one'] });
    act(() => root.unmount());
    expect(find('reg.mounted')).toMatchObject({ mounted: false, commands: ['reg.one'] });
  });

  it('lets the mounted hook win over a static definition of the same id', () => {
    const root = createRoot(document.createElement('div'));
    act(() => root.render(createElement(Mounted)));
    defineContextMenu('reg.mounted', ['reg.other']);
    expect(find('reg.mounted')?.commands).toEqual(['reg.one']);
    act(() => root.unmount());
  });

  it('does not make a defined menu open: only a mounted hook does', () => {
    defineContextMenu('reg.static', ['reg.two']);
    expect(useContextMenuStore.getState().menus).toEqual({});
  });
});
