/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { MAIN_LINK } from './widget-review.constants';

const realClick = async (target: Element): Promise<void> => {
  const box = target.getBoundingClientRect();
  const point = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  await probe({ kind: 'mouse', id: MAIN_LINK, action: 'down', point });
  await probe({ kind: 'mouse', id: MAIN_LINK, action: 'up', point });
  await settle();
};

const nameOf = (element: Element): string => {
  const label = element.getAttribute('aria-label') ?? element.textContent.trim().slice(0, 40);
  return `${element.tagName.toLowerCase()}${label ? ` "${label}"` : ''}`;
};

const checkWidgetFocus = async (tour: StepTour, widget: Element): Promise<void> => {
  if (!tour.env.product.widgets.keepFocusWithApp) return;
  const button = find(SELECTORS.widgetOptionsButton, widget);
  if (button === null) {
    tour.check('widget-click-keeps-focus', false, '', 'the docked logs widget shows no options button to click');
    return;
  }
  await realClick(button);
  const opened = await waitFor(() => find(SELECTORS.widgetOptionsPanel)) !== null;
  await realClick(button);
  await waitFor(() => find(SELECTORS.widgetOptionsPanel) === null);
  const active = document.activeElement;
  const inside = active !== null && widget.contains(active);
  tour.check(
    'widget-click-keeps-focus',
    opened && !inside,
    'two real clicks on the docked logs widget\'s options button opened and closed its options and left the focus outside the widget',
    opened ? `after real clicks on the docked logs widget's options button the focus is on ${active ? nameOf(active) : 'nothing'} inside the widget` : 'a real click on the docked logs widget\'s options button did not open its options',
  );
};

export { checkWidgetFocus };
