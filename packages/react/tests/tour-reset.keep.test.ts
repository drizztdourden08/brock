/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { screenReset } from '../src/screens/screen-reset';
import { ScreenStateScope } from '../src/screens/screen-state-scope';
import { useScreenStateStore } from '../src/stores/useScreenStateStore';
import { prepareStep } from '../src/tours/prepare-step';
import { tourTargets } from '../src/tours/resolve-tour-target';
import { useTourReset } from '../src/tours/useTourReset';

const signal = (): AbortSignal => new AbortController().signal;

afterEach(() => {
  useScreenStateStore.getState().hydrate({});
  useNavigationStore.getState().close();
  document.body.replaceChildren();
});

describe('tour step reset', () => {
  it('calls the handler of the open screen with only the parts the step names', async () => {
    useNavigationStore.getState().open('sessions');
    const handler = vi.fn();
    const off = screenReset.onReset('sessions', handler);
    await prepareStep('t', { id: 's', title: 'S', body: 'B', reset: { search: true, tab: true } }, 0, signal());
    expect(handler).toHaveBeenCalledWith({ search: true, filters: false, tab: true, selection: false });
    off();
  });

  it('resets all four parts for true, and also reaches the sub scopes of a hub', async () => {
    useNavigationStore.getState().open('sessions');
    const handler = vi.fn();
    const off = screenReset.onReset('sessions/list', handler);
    const other = vi.fn();
    const offOther = screenReset.onReset('settings', other);
    await prepareStep('t', { id: 's', title: 'S', body: 'B', reset: true }, 0, signal());
    expect(handler).toHaveBeenCalledWith({ search: true, filters: true, tab: true, selection: true });
    expect(other).not.toHaveBeenCalled();
    off();
    offOther();
  });

  it('does nothing for a screen with no handler, and for a step without reset', async () => {
    useNavigationStore.getState().open('sessions');
    const handler = vi.fn();
    const off = screenReset.onReset('sessions', handler);
    await prepareStep('t', { id: 's', title: 'S', body: 'B' }, 0, signal());
    expect(handler).not.toHaveBeenCalled();
    off();
    await expect(prepareStep('t', { id: 's', title: 'S', body: 'B', reset: true }, 0, signal())).resolves.toBeUndefined();
  });

  it('clears the stored search and tab of the screen through the store, and a classified key', async () => {
    useNavigationStore.getState().open('sessions');
    useScreenStateStore.getState().hydrate({
      'sessions': { 'tab:list': 'b' },
      'sessions/list': { 'header.search': 'abc', 'status': 'open', 'mine': true },
      'other': { 'header.search': 'keep' },
    });
    screenReset.classify('sessions/list', 'status', 'filters');
    await prepareStep('t', { id: 's', title: 'S', body: 'B', reset: { search: true, filters: true } }, 0, signal());
    expect(useScreenStateStore.getState().byScope).toEqual({
      'sessions': { 'tab:list': 'b' },
      'sessions/list': { mine: true },
      'other': { 'header.search': 'keep' },
    });
    await prepareStep('t', { id: 's', title: 'S', body: 'B', reset: { tab: true } }, 0, signal());
    expect(useScreenStateStore.getState().byScope['sessions']).toEqual({});
  });

});

describe('useTourReset', () => {
  it('registers a component handler and drops it on unmount', () => {
    useNavigationStore.getState().open('sessions');
    const handler = vi.fn();
    const Probe = () => {
      useTourReset(handler);
      return null;
    };
    const root = createRoot(document.createElement('div'));
    act(() => root.render(createElement(ScreenStateScope.Provider, { value: 'sessions' }, createElement(Probe))));
    screenReset.reset('sessions', { selection: true });
    expect(handler).toHaveBeenCalledWith({ search: false, filters: false, tab: false, selection: true });
    act(() => root.unmount());
    screenReset.reset('sessions', true);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('new tour shell parts', () => {
  const LAYER = '<div class="screen-layer"><div class="screen-layer__card">' +
    '<div class="header-actions"><button class="btn btn--secondary">Other</button><button class="btn btn--primary" id="primary">New</button></div>' +
    '<button class="content-header__back" id="back">Back</button>' +
    '<nav class="side-nav"><button class="side-nav__item" aria-label="Games" id="games"></button><button class="side-nav__item" aria-label="Files"></button></nav>' +
    '</div></div>';
  const MENU = '<div class="dropdown-menu" id="root-menu"><div class="dropdown-menu dropdown-menu--sub" id="sub"></div></div>';

  it('lights the primary button, the back button, one rail entry and the root menu panel', () => {
    document.body.innerHTML = LAYER + MENU;
    expect(tourTargets.resolve({ shell: 'primary' })).toBe(document.getElementById('primary'));
    expect(tourTargets.resolve({ shell: 'back' })).toBe(document.getElementById('back'));
    expect(tourTargets.resolve({ shell: 'rail', entry: 'Games' })).toBe(document.getElementById('games'));
    expect(tourTargets.resolve({ shell: 'menu-panel' })).toBe(document.getElementById('root-menu'));
    expect(tourTargets.resolve({ shell: 'rail', entry: 'Nope' })).toBeNull();
  });

  it('ignores a hidden screen layer', () => {
    document.body.innerHTML = LAYER;
    document.querySelector('.screen-layer')?.classList.add('screen-layer--hidden');
    expect(tourTargets.resolve({ shell: 'primary' })).toBeNull();
    expect(tourTargets.resolve({ shell: 'rail', entry: 'Games' })).toBeNull();
  });
});
