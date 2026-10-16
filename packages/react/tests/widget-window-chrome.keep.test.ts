/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WidgetWindow } from '../src/widgets/WidgetWindow';
import { defineWidget } from '../src/widgets/define-widget';

vi.mock('../src/overlays/StandardOverlays/StandardOverlays', () => ({ StandardOverlays: () => null }));

let root: Root | null = null;

const draw = (chrome?: 'compact' | 'none'): void => {
  document.body.innerHTML = '<div id="host"></div>';
  root = createRoot(document.getElementById('host') as HTMLElement);
  const widget = defineWidget({ id: 'tool', label: 'Tool', chrome, render: () => createElement('p', { className: 'tool-body' }, 'Body') });
  act(() => root?.render(createElement(WidgetWindow, { id: 'tool', widgets: [widget] })));
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.replaceChildren();
});

describe('a popped widget window', () => {
  it('draws the widget with the chrome its definition names, and the full title bar without one', () => {
    draw('compact');
    expect(document.querySelector('.widget--chrome-compact .tool-body')).not.toBeNull();
    act(() => root?.unmount());
    draw();
    expect(document.querySelector('[class*="widget--chrome-"]')).toBeNull();
    expect(document.querySelector('.tool-body')?.textContent).toBe('Body');
  });
});
