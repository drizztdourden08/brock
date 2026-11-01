/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { toast as tesseraToast } from '@drizztdourden08/tessera/composites';
import { dismissToast } from '../src/toast/dismiss-toast';
import { toast } from '../src/toast/toast';
import { ToastHost } from '../src/toast/ToastHost';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let roots: Root[] = [];

afterEach(() => {
  act(() => {
    roots.forEach((root) => root.unmount());
    tesseraToast.clear();
  });
  roots = [];
  document.body.innerHTML = '';
});

const mountHost = (): void => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push(root);
  act(() => root.render(createElement(ToastHost)));
};

const shown = (): Element[] => [...document.querySelectorAll('.toast')];

const raise = (...args: Parameters<typeof toast>): string => {
  let id = '';
  act(() => { id = toast(...args); });
  return id;
};

describe('S1 toast', { tags: ['standard'] }, () => {
  it('raises through Tessera\'s queue, drawn by one ToastStack, and joins a repeat with a count', () => {
    mountHost();
    const first = raise('Saved');
    const again = raise('Saved');
    expect(again).toBe(first);
    expect(shown()).toHaveLength(1);
    expect(document.querySelector('.toast__count')?.textContent).toBe('×2');
  });

  it('dismisses by the id toast returned', () => {
    mountHost();
    const id = raise('Copied', { variant: 'success' });
    act(() => dismissToast(id));
    expect(shown()).toHaveLength(0);
  });

  it('draws one stack when a second host mounts', () => {
    mountHost();
    mountHost();
    raise('Once');
    expect(document.querySelectorAll('.toast-container')).toHaveLength(1);
  });
});
