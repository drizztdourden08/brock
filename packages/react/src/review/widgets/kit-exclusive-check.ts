/* @layer renderer-shell @kind logic */
import { widgetKits } from '../../widgets/kits/widget-kits';
import { WIDGET_KEY_PREFIX } from '../../widgets/widget.constants';
import { widgets } from '../../widgets/widgets';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { closeMenu } from '../menu/close-menu';
import { walkToKey } from '../menu/walk-to-key';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { KIT_NORMAL_WIDGET, OTHER_KIT_ID, OTHER_KIT_MEMBER, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, kitSelectors } from './kit-review.constants';

const otherDrawn = (): boolean => find(kitSelectors.bar(OTHER_KIT_ID)) !== null && find(kitSelectors.widget(OTHER_KIT_MEMBER)) !== null;

const normalBack = (): boolean => kitDrawn.none() && !otherDrawn() && find(kitSelectors.widget(KIT_NORMAL_WIDGET)) !== null;

const reopen = async (): Promise<void> => {
  widgetKits.open(REVIEW_KIT_ID);
  await waitFor(kitDrawn.all);
};

const normalFromMenu = async (tour: StepTour): Promise<void> => {
  const { item } = await walkToKey(tour.env.menu, `${WIDGET_KEY_PREFIX}${KIT_NORMAL_WIDGET}`);
  const enabled = item !== null && item.getAttribute('aria-disabled') !== 'true' && !item.hasAttribute('data-disabled');
  tour.check('kit-normal-entry-enabled', enabled, `the "${KIT_NORMAL_WIDGET}" menu entry stays enabled while a kit is open`, `the "${KIT_NORMAL_WIDGET}" menu entry is missing or disabled while a kit is open`);
  if (item && enabled) click(item);
  await closeMenu();
  const back = await waitFor(normalBack);
  tour.check('kit-closed-by-menu-widget', back !== null, 'picking a normal widget in the menu closed the kit and gave the normal layout back with that widget open', 'picking a normal widget in the menu left the kit open or the widget hidden');
};

const checkKitExclusive = async (tour: StepTour): Promise<void> => {
  await reopen();
  widgetKits.open(OTHER_KIT_ID);
  const swapped = await waitFor(() => kitDrawn.none() && otherDrawn());
  tour.check('kit-one-at-a-time', swapped !== null, 'opening another kit closed the open one first: only the second kit\'s widgets and bar are on screen', 'opening another kit left the first one on screen');
  widgets.open(REVIEW_KIT_MEMBERS[0]);
  const back = await waitFor(() => kitDrawn.all() && !otherDrawn());
  tour.check('kit-widget-switches-kit', back !== null, 'widgets.open on a widget of another kit closed the open kit and opened that widget\'s kit', 'widgets.open on a widget of another kit did not switch kits');
  await normalFromMenu(tour);
  await reopen();
  widgets.open(KIT_NORMAL_WIDGET);
  const closed = await waitFor(normalBack);
  tour.check('kit-closed-by-widgets-open', closed !== null, 'widgets.open on a normal widget closed the kit and gave the normal layout back with that widget open', 'widgets.open on a normal widget left the kit open');
  await reopen();
};

export { checkKitExclusive };
