/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Profile } from '@drizztdourden08/brock-core';
import { useStartupPrompts } from '../src/startup/useStartupPrompts';
import type { StartupPromptContext, StartupPromptDef } from '../src/startup/startup.type';
import { createSettingsStore } from '../src/stores/create-settings-store';
import { useProfilesStore } from '../src/stores/useProfilesStore';
import { EMPTY_PROGRESS, NO_TOURS } from '../src/tours/tours.constants';
import { useTourStore } from '../src/tours/useTourStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

interface Prefs {
  mode: string;
}

const PROFILE: Profile = { id: 'p1', name: 'One', created: 1, lastPlayed: 1 };

const noop = (): Promise<void> => Promise.resolve();

const roots: Root[] = [];

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => { setTimeout(resolve, 10); });
  });
};

const newStore = () => createSettingsStore<Prefs>({ defaults: { mode: 'a' }, load: () => Promise.resolve(null), save: noop });

const mount = (ready: boolean, prompts: readonly StartupPromptDef[], store = newStore()) => {
  const Harness = (props: { ready: boolean }) => {
    useStartupPrompts({ ready: props.ready, settingsStore: store, prompts });
    return null;
  };
  const root = createRoot(document.body.appendChild(document.createElement('div')));
  roots.push(root);
  const render = (next: boolean) => act(() => root.render(createElement(Harness, { ready: next })));
  render(ready);
  return { render, store };
};

const arrive = async (store: ReturnType<typeof newStore>, tour: Partial<ReturnType<typeof useTourStore.getState>> = { loaded: true, firstUse: false }): Promise<void> => {
  useProfilesStore.setState({ active: PROFILE });
  await act(async () => { await store.getState().hydrate(PROFILE.id); });
  act(() => useTourStore.setState(tour));
  await settle();
};

const stub = (automation: boolean): void => {
  vi.stubGlobal('api', { startup: { automation, flags: {} } });
};

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  useProfilesStore.setState({ active: null });
  useTourStore.setState({ tours: NO_TOURS, active: null, progress: EMPTY_PROGRESS, loaded: false, firstUse: false, starting: false });
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('useStartupPrompts', () => {
  it('waits for the window reveal, an active profile with its settings, and the end of the first-run tour', async () => {
    stub(false);
    const run = vi.fn(noop);
    const { render, store } = mount(false, [{ run }]);
    await settle();
    expect(run).not.toHaveBeenCalled();
    useProfilesStore.setState({ active: PROFILE });
    await act(async () => { await store.getState().hydrate(PROFILE.id); });
    act(() => useTourStore.setState({ loaded: true, firstUse: true }));
    render(true);
    await settle();
    expect(run).not.toHaveBeenCalled();
    act(() => useTourStore.setState({ firstUse: false, active: { id: 'welcome', index: 0 } }));
    await settle();
    expect(run).not.toHaveBeenCalled();
    act(() => useTourStore.setState({ active: null, starting: true }));
    await settle();
    expect(run).not.toHaveBeenCalled();
    act(() => useTourStore.setState({ starting: false }));
    await settle();
    expect(run).toHaveBeenCalledTimes(1);
  });

});

describe('useStartupPrompts once it runs', () => {
  it('runs the ordered prompts one at a time, once per launch, with the profile, the settings and the dialogs', async () => {
    stub(false);
    const order: string[] = [];
    const contexts: StartupPromptContext[] = [];
    const first: StartupPromptDef = { run: async (given) => { contexts.push(given); order.push('first'); await new Promise((resolve) => { setTimeout(resolve, 15); }); order.push('first done'); } };
    const second: StartupPromptDef = { run: () => { order.push('second'); return Promise.resolve(); } };
    const { render, store } = mount(true, [first, second]);
    await arrive(store);
    await settle();
    await settle();
    expect(order).toEqual(['first', 'first done', 'second']);
    const seen = contexts.at(0);
    expect(seen?.profile).toEqual(PROFILE);
    expect(seen?.settings.get()).toEqual({ mode: 'a' });
    seen?.settings.patch({ mode: 'b' });
    expect(store.getState().settings.mode).toBe('b');
    expect(typeof seen?.confirmAction).toBe('function');
    expect(typeof seen?.confirmChoice).toBe('function');
    expect(typeof seen?.nav.open).toBe('function');
    render(false);
    render(true);
    act(() => useTourStore.setState({ active: { id: 'again', index: 0 } }));
    act(() => useTourStore.setState({ active: null }));
    await settle();
    expect(order).toEqual(['first', 'first done', 'second']);
  });

  it('never runs on an automation launch', async () => {
    stub(true);
    const run = vi.fn(noop);
    const { store } = mount(true, [{ run }]);
    await arrive(store);
    expect(run).not.toHaveBeenCalled();
  });

  it('keeps going past a prompt that throws', async () => {
    stub(false);
    const after = vi.fn(noop);
    const { store } = mount(true, [{ run: () => Promise.reject(new Error('bad')) }, { run: after }]);
    await arrive(store);
    await settle();
    expect(after).toHaveBeenCalledTimes(1);
  });
});
