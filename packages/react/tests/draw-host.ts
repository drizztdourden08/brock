/* @layer renderer-shell @kind test */
import { act } from 'react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

const drawn: { root: Root | null } = { root: null };

const drawInHost = (element: ReactElement): void => {
  document.body.innerHTML = '<div id="host"></div>';
  drawn.root = createRoot(document.getElementById('host') as HTMLElement);
  act(() => drawn.root?.render(element));
};

const undrawHost = (): void => {
  act(() => drawn.root?.unmount());
  drawn.root = null;
  document.body.replaceChildren();
};

export { drawInHost, undrawHost };
