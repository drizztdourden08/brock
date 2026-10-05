/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { createDefaultLayout, visibleLayoutOf } from '@drizztdourden08/tessera/composites';
import type { WidgetContextActive, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { contexts } from '../src/contexts/contexts';
import { DEFAULT_CONTEXT, INITIAL_CONTEXTS } from '../src/contexts/contexts.constants';
import { useAppContext } from '../src/contexts/useAppContext';
import { useContextsStore } from '../src/contexts/useContextsStore';
import { useSetAppContext } from '../src/contexts/useSetAppContext';
import { defineWidget } from '../src/widgets/define-widget';
import { useContextActive } from '../src/widgets/WidgetHost/behavior/useContextActive';
import type { WidgetDef } from '../src/widgets/widget.type';
import { widgetsFromFiles } from '../src/widgets/widgets-from-files';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const players = defineWidget({ id: 'players', label: 'Players', render: () => null, context: 'session' });
const legacy = defineWidget({ id: 'legacy', label: 'Legacy', render: () => null, defaultVisibility: 'context-only' });
const logs = defineWidget({ id: 'logs', label: 'Logs', render: () => null });
const definitions = [players, legacy, logs];
const layout: WidgetLayout = { ...createDefaultLayout(), floating: definitions.map((def) => ({ id: def.id, x: 0, y: 0, width: 200, height: 120 })) };
const gatesOf = (contextActive: WidgetContextActive<WidgetDef>) => ({ definitions, contextActive, pageOpen: false, developerToolsEnabled: true, forcedIds: [], contentIds: definitions.map((def) => def.id) });

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  useContextsStore.setState({ contexts: INITIAL_CONTEXTS });
});

describe('the context registry', () => {
  it('starts with the default context active and every other one inactive', () => {
    expect(contexts.isActive(DEFAULT_CONTEXT)).toBe(true);
    expect(contexts.get('session')).toEqual({ active: false });
  });

  it('sets, reads and clears a named context with its data', () => {
    contexts.set('session', { active: true, data: { room: 'Lobby' } });
    expect(contexts.get<{ room: string }>('session').data?.room).toBe('Lobby');
    expect(contexts.isActive('session')).toBe(true);
    contexts.clear('session');
    expect(contexts.isActive('session')).toBe(false);
  });

  it('hydrates from a relayed record and drops the malformed entries', () => {
    useContextsStore.getState().hydrate({ session: { active: true, data: 3 }, broken: { active: 'yes' }, other: null });
    expect(useContextsStore.getState().contexts).toEqual({ session: { active: true, data: 3 } });
    useContextsStore.getState().hydrate('nonsense');
    expect(useContextsStore.getState().contexts).toEqual({});
  });

  it('sets a context while a component holds it and makes it inactive when it unmounts', () => {
    const seen: boolean[] = [];
    const Provider = () => {
      useSetAppContext('session', true, { room: 'Lobby' });
      return null;
    };
    const Reader = () => {
      seen.push(useAppContext('session').active);
      return null;
    };
    const host = document.createElement('div');
    root = createRoot(host);
    act(() => root?.render(createElement('div', null, createElement(Provider), createElement(Reader))));
    expect(contexts.get('session')).toEqual({ active: true, data: { room: 'Lobby' } });
    expect(seen.at(-1)).toBe(true);
    act(() => root?.render(createElement(Reader)));
    expect(contexts.isActive('session')).toBe(false);
    expect(seen.at(-1)).toBe(false);
  });
});

describe('widgets that need a context', () => {
  it('makes a widget that names a context context-only unless it says otherwise', () => {
    expect(players.defaultVisibility).toBe('context-only');
    expect(logs.defaultVisibility).toBe('always');
    const always = defineWidget({ id: 'radar', label: 'Radar', render: () => null, context: 'session', defaultVisibility: 'always' });
    expect(always.defaultVisibility).toBe('always');
    const [fromFile] = widgetsFromFiles([{ id: 'score', component: () => null, meta: { context: 'session' } }]);
    expect(fromFile?.context).toBe('session');
    expect(fromFile?.defaultVisibility).toBe('context-only');
  });

  const answers: WidgetContextActive<WidgetDef>[] = [];
  const Probe = (props: { legacy: boolean | null; tick: number }) => {
    answers.push(useContextActive(props.legacy));
    return null;
  };
  const answerWith = (legacy: boolean | null = null): WidgetContextActive<WidgetDef> => {
    act(() => root?.unmount());
    root = createRoot(document.createElement('div'));
    act(() => root?.render(createElement(Probe, { legacy, tick: 0 })));
    return answers.at(-1) ?? false;
  };

  it('keeps the same answer across renders until a context changes', () => {
    const first = answerWith();
    act(() => root?.render(createElement(Probe, { legacy: null, tick: 1 })));
    expect(answers.at(-1)).toBe(first);
    act(() => contexts.set('session', { active: true }));
    expect(answers.at(-1)).not.toBe(first);
  });

  const shown = (contextActive: WidgetContextActive<WidgetDef>, at: WidgetLayout = layout): string[] =>
    visibleLayoutOf(at, gatesOf(contextActive)).floating.map((f) => f.id);

  it('answers WidgetManager for each widget from its own context in the registry', () => {
    expect(shown(answerWith())).toEqual(['legacy', 'logs']);
    contexts.set('session', { active: true });
    expect(shown(answerWith())).toEqual(['players', 'legacy', 'logs']);
    contexts.set(DEFAULT_CONTEXT, { active: false });
    expect(shown(answerWith())).toEqual(['players', 'logs']);
  });

  it('lets the deprecated widgetContext hook drive the default context', () => {
    contexts.set(DEFAULT_CONTEXT, { active: true });
    expect(shown(answerWith(false))).toEqual(['logs']);
  });

  it('keeps a widget the user set to always shown whatever its context', () => {
    const shownAlways = { ...layout, frame: { players: { opacity: 1, show: 'always' as const } } };
    contexts.set(DEFAULT_CONTEXT, { active: false });
    expect(shown(answerWith(), shownAlways)).toEqual(['players', 'logs']);
  });
});
