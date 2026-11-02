/* @layer renderer-shell @kind test */
import { act } from 'react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const mountedRoots: Root[] = [];

const renderInto = (element: ReactElement, host: HTMLElement): void => {
  const root = createRoot(host);
  mountedRoots.push(root);
  act(() => root.render(element));
};

const renderInBody = (element: ReactElement): HTMLElement => {
  const host = document.createElement('div');
  document.body.append(host);
  renderInto(element, host);
  return host;
};

const unmountAll = (): void => {
  act(() => { mountedRoots.splice(0).forEach((root) => root.unmount()); });
  document.body.innerHTML = '';
};

export { renderInBody, renderInto, unmountAll };
