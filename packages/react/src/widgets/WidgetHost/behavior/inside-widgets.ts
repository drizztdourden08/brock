/* @layer renderer-shell @kind logic */
import { OPTIONS_SUB_PANEL, OPTIONS_SUB_ROWS, WIDGET_SCOPE } from './useWidgetsNeverFocus.constants';

const inOptionsSubPanel = (element: Element): boolean => {
  const panel = element.closest(OPTIONS_SUB_PANEL);
  if (panel === null) return false;
  return [...element.ownerDocument.querySelectorAll(OPTIONS_SUB_ROWS)].some((row) => row.getAttribute('aria-controls') === panel.id);
};

const insideWidgets = (target: EventTarget | null): target is Element =>
  target instanceof Element && (target.closest(WIDGET_SCOPE) !== null || inOptionsSubPanel(target));

export { insideWidgets };
