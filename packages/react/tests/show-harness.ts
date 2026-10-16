/* @layer renderer-shell @kind test */
import { act } from 'react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { platformState } from '../src/platform/platform-state';
import { useShowFlagsStore } from '../src/screens/show/useShowFlagsStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const state: { root: Root | null; host: HTMLElement | null } = { root: null, host: null };

const render = (element: ReactElement): HTMLElement => {
  if (state.root === null || state.host === null) {
    state.host = document.body.appendChild(document.createElement('div'));
    state.root = createRoot(state.host);
  }
  act(() => state.root?.render(element));
  return state.host;
};

const unmount = (): void => {
  act(() => state.root?.unmount());
  state.root = null;
  state.host = null;
};

const resetShow = (): void => {
  unmount();
  document.body.innerHTML = '';
  platformState.platform = null;
  useShowFlagsStore.setState({ sources: {}, flags: {} });
  useNavigationStore.getState().setEscapeTo(null);
};

const showHarness = { render, unmount, resetShow };

export { showHarness };
