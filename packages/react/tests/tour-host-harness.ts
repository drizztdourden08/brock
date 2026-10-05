/* @layer renderer-shell @kind test */
import { act, createElement } from 'react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { TourHost } from '../src/tours/TourHost';
import { EMPTY_PROGRESS, NO_TOURS } from '../src/tours/tours.constants';
import type { TourDef } from '../src/tours/tour.type';
import { useTourStore } from '../src/tours/useTourStore';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { useWidgetRelayStore } from '../src/widgets/useWidgetRelayStore';

const APP = '<div id="app"></div><div class="shell"><header class="window-title-bar"><button>Menu</button></header><main class="rest"><div data-tour="two">Two</div></main></div>';

const roots: Root[] = [];

const flush = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => { setTimeout(resolve, 50); });
  });
};

const renderInto = (id: string, element: ReactElement): Root => {
  const root = createRoot(document.getElementById(id) as HTMLElement);
  roots.push(root);
  act(() => root.render(element));
  return root;
};

const mount = (list: readonly TourDef[]): Root => {
  document.body.innerHTML = APP;
  const root = renderInto('app', createElement(TourHost, { ready: false }));
  useTourStore.getState().setTours(list);
  return root;
};

const unmount = (root: Root): void => {
  act(() => root.unmount());
  roots.splice(roots.indexOf(root), 1);
};

const popWidget = (id: string): void => {
  const { layout } = useWidgetLayoutStore.getState();
  useWidgetLayoutStore.setState({ layout: { ...layout, popped: [{ id }] } });
};

const clickOn = (selector: string): void => {
  act(() => { document.querySelector(selector)?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
};

const stepShown = (): string | null | undefined => document.querySelector('.guided-tour')?.getAttribute('data-step');

const cleanUp = (): void => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  Reflect.deleteProperty(window, 'api');
  const { layout } = useWidgetLayoutStore.getState();
  useWidgetLayoutStore.setState({ layout: { ...layout, popped: [] } });
  useTourStore.setState({ tours: NO_TOURS, active: null, progress: EMPTY_PROGRESS, progressFor: null, shown: null, spot: null, clickRelay: null });
  useWidgetRelayStore.setState({ slices: {} });
  document.body.replaceChildren();
};

const tourHarness = { flush, mount, renderInto, unmount, popWidget, clickOn, stepShown, cleanUp };

export { tourHarness };
