/* @layer renderer-shell @kind logic */
import type { ReviewOutcome, ScreenFocusSnapshot } from '../review.type';
import { outcome } from './outcome';

const screenFocusChecks = (id: string, snapshot: ScreenFocusSnapshot): ReviewOutcome[] => {
  const { focusInside, pageInert, titleBarReachable, dockReachable } = snapshot;
  return [
    outcome(`${id}-focus-in`, focusInside, `focus moved into "${id}"`, `focus stayed outside "${id}" after it opened`),
    outcome(`${id}-page-inert`, pageInert, `the page behind "${id}" is inert`, `the page behind "${id}" still takes focus and clicks`),
    ...(titleBarReachable === null ? [] : [outcome(`${id}-title-bar-usable`, titleBarReachable, `the title bar stays usable over "${id}"`, `the title bar is inert while "${id}" is open`)]),
    ...(dockReachable === null ? [] : [outcome(`${id}-dock-usable`, dockReachable, `the widget dock stays usable over "${id}"`, `the widget dock is inert while "${id}" is open`)]),
  ];
};

export { screenFocusChecks };
