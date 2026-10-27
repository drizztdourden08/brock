/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WidgetManager, createDefaultLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { contexts } from '../src/contexts/contexts';
import { INITIAL_CONTEXTS } from '../src/contexts/contexts.constants';
import { useContextsStore } from '../src/contexts/useContextsStore';
import { defineWidget } from '../src/widgets/define-widget';
import { useContextTitles } from '../src/widgets/WidgetHost/behavior/useContextTitles';
import { WidgetWindow } from '../src/widgets/WidgetWindow';

vi.mock('../src/overlays/StandardOverlays/StandardOverlays', () => ({ StandardOverlays: () => null }));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const players = defineWidget({ id: 'players', label: 'Players', render: () => null, context: 'session' });
const logs = defineWidget({ id: 'logs', label: 'Logs', render: () => null });
const definitions = [players, logs];
const layout: WidgetLayout = { ...createDefaultLayout(), floating: definitions.map((def) => ({ id: def.id, x: 0, y: 0, width: 200, height: 120 })) };
const noop = (): undefined => undefined;

let root: Root | null = null;

const Dock = () =>
  createElement(WidgetManager, {
    definitions: useContextTitles(definitions), layout, onLayoutChange: noop, contextActive: () => true, main: null, children: { players: 'p', logs: 'l' },
  });

const draw = (element: ReturnType<typeof createElement>): void => {
  document.body.innerHTML = '<div id="host"></div>';
  root = createRoot(document.getElementById('host') as HTMLElement);
  act(() => root?.render(element));
};

const titles = (): string[] => [...document.querySelectorAll('.widget__title')].map((node) => node.textContent);

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.replaceChildren();
  useContextsStore.setState({ contexts: INITIAL_CONTEXTS });
});

describe('a context label in a docked widget title', () => {
  it('reads the context label after the title, and leaves other widgets alone', () => {
    contexts.set('session', { active: true, label: 'Sunday run' });
    draw(createElement(Dock));
    expect(titles()).toContain('Players, Sunday run');
    expect(titles()).toContain('Logs');
  });

  it('keeps the plain title with no label or a blank label', () => {
    contexts.set('session', { active: true });
    draw(createElement(Dock));
    expect(titles()).toContain('Players');
    act(() => contexts.set('session', { active: true, label: '  ' }));
    expect(titles()).toContain('Players');
  });

  it('follows a changed label', () => {
    contexts.set('session', { active: true, label: 'Sunday run' });
    draw(createElement(Dock));
    act(() => contexts.set('session', { active: true, label: 'Monday run' }));
    expect(titles()).toContain('Players, Monday run');
    act(() => contexts.set('session', { active: true }));
    expect(titles()).toContain('Players');
  });
});

describe('a context label in a popped widget window title', () => {
  it('reads the relayed label after the title and follows a change', () => {
    contexts.set('session', { active: true, label: 'Sunday run' });
    draw(createElement(WidgetWindow, { id: 'players', widgets: [players] }));
    expect(titles()).toEqual(['Players, Sunday run']);
    act(() => useContextsStore.getState().hydrate({ session: { active: true, label: 'Monday run' } }));
    expect(titles()).toEqual(['Players, Monday run']);
  });

  it('keeps the plain title with no label', () => {
    contexts.set('session', { active: true });
    draw(createElement(WidgetWindow, { id: 'players', widgets: [players] }));
    expect(titles()).toEqual(['Players']);
  });
});
