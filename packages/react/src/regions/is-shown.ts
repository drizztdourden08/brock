/* @layer renderer-shell @kind logic */
import { HIDDEN_SELECTOR } from './regions.constants';

const isShown = (element: HTMLElement): boolean => element.closest(HIDDEN_SELECTOR) === null && element.checkVisibility({ visibilityProperty: true });

export { isShown };
