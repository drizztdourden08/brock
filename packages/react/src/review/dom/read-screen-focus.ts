/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { ScreenFocusSnapshot } from '../review.type';

const reachable = (element: Element | null): boolean | null => (element === null ? null : element.closest('[inert]') === null);

const readScreenFocus = (layer: HTMLElement): ScreenFocusSnapshot => {
  const siblings = [...(layer.parentElement?.children ?? [])].filter((el) => el !== layer && !el.classList.contains('screen-layer--hidden'));
  const pane = [...document.querySelectorAll(SELECTORS.dockPane)].find((el) => !el.contains(layer)) ?? null;
  return {
    focusInside: layer.contains(document.activeElement),
    pageInert: siblings.every((el) => el.closest('[inert]') !== null),
    titleBarReachable: reachable(document.querySelector(SELECTORS.titleBar)),
    dockReachable: reachable(pane),
  };
};

export { readScreenFocus };
