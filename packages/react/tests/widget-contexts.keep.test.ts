/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { createDefaultLayout } from '@drizztdourden08/tessera/composites';
import { contexts } from '../src/contexts/contexts';
import { DEFAULT_CONTEXT, INITIAL_CONTEXTS } from '../src/contexts/contexts.constants';
import { useAppContext } from '../src/contexts/useAppContext';
import { useContextsStore } from '../src/contexts/useContextsStore';
import { useSetAppContext } from '../src/contexts/useSetAppContext';
import { defineWidget } from '../src/widgets/define-widget';
import { outOfContext } from '../src/widgets/out-of-context';
import { widgetsFromFiles } from '../src/widgets/widgets-from-files';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const players = defineWidget({ id: 'players', label: 'Players', render: () => null, context: 'session' });
const legacy = defineWidget({ id: 'legacy', label: 'Legacy', render: () => null, defaultVisibility: 'context-only' });
const logs = defineWidget({ id: 'logs', label: 'Logs', render: () => null });
const definitions = [players, legacy, logs];
const layout = createDefaultLayout();
const activeIn = (names: readonly string[]) => (name: string) => names.includes(name);

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

  it('hides each widget while its own context is inactive', () => {
    expect(outOfContext(layout, definitions, activeIn([DEFAULT_CONTEXT]))).toEqual(['players']);
    expect(outOfContext(layout, definitions, activeIn(['session']))).toEqual(['legacy']);
    expect(outOfContext(layout, definitions, activeIn([DEFAULT_CONTEXT, 'session']))).toEqual([]);
  });

  it('keeps a widget the user set to always shown whatever its context', () => {
    const shownAlways = { ...layout, frame: { players: { opacity: 1, show: 'always' as const } } };
    expect(outOfContext(shownAlways, definitions, activeIn([]))).toEqual(['legacy']);
  });
});
