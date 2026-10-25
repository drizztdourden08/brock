/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createToolbarLayout } from '@drizztdourden08/tessera/composites';
import { appLogState } from '../src/log/app-log-state';
import { createAppLog } from '../src/log/create-app-log';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { hostClaim } from '../src/toolbars/host-claim';
import { ToolbarHost } from '../src/toolbars/ToolbarHost';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const TOOLS = defineToolbar({ id: 'tools', label: 'Tools', defaultSide: 'left', render: () => createElement('i', { className: 'tools-bar' }) });

let root: Root | null = null;

beforeEach(() => {
  hostClaim.reset();
  createAppLog();
  useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
});

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.replaceChildren();
});

const mount = (element: ReactElement): void => {
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(element));
};

describe('the one toolbar host', () => {
  it('draws the registered toolbars around its children when it is the only host', () => {
    useToolbarLayoutStore.getState().setDefinitions([TOOLS]);
    mount(createElement(ToolbarHost, { children: createElement('b', { className: 'work-area' }) }));
    expect(document.querySelectorAll('.toolbar-dock')).toHaveLength(1);
    expect(document.querySelectorAll('.tools-bar')).toHaveLength(1);
    expect(document.querySelector('.toolbar-dock__centre .work-area')).not.toBeNull();
    expect(appLogState.counts.warn).toBe(0);
  });

  it('warns once for a second host and renders only its children', () => {
    useToolbarLayoutStore.getState().setDefinitions([TOOLS]);
    const first = createElement(ToolbarHost, { key: 'one', children: createElement('b', { className: 'first' }) });
    const second = createElement(ToolbarHost, { key: 'two', children: createElement('u', { className: 'second' }) });
    const third = createElement(ToolbarHost, { key: 'three', children: createElement('s', { className: 'third' }) });
    mount(createElement('div', null, first, second, third));
    expect(document.querySelectorAll('.toolbar-dock')).toHaveLength(1);
    expect(document.querySelectorAll('.tools-bar')).toHaveLength(1);
    expect(document.querySelector('.toolbar-dock .second')).toBeNull();
    expect(document.querySelector('.second')).not.toBeNull();
    expect(document.querySelector('.third')).not.toBeNull();
    expect(appLogState.counts.warn).toBe(1);
  });
});
