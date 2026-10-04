/* @layer renderer-shell @kind logic */
import { isWidgetOpen, widgetsIn } from '@drizztdourden08/tessera/composites';
import { LOGS_WIDGET_ID } from '../../widgets/built-in/LogsWidget/LogsWidget.constants';
import { presetLayout } from '../../widgets/preset-layout';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { RESET_LAYOUT_ENTRY } from '../../widgets/widget.constants';
import { widgets } from '../../widgets/widgets';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';

const store = () => useWidgetLayoutStore.getState();

const checkResetLayout = async (tour: StepTour): Promise<void> => {
  const path = menuPathTo(tour.env.menu, (item) => item.key === RESET_LAYOUT_ENTRY.key);
  tour.check('reset-layout-entry', path !== null && path.at(-1) === RESET_LAYOUT_ENTRY.label, `the Widgets menu ends with ${path?.join(' > ') ?? ''}`, 'the menu has no Reset layout entry');
  if (!path) return;
  const before = store().layout;
  widgets.open(LOGS_WIDGET_ID);
  await waitFor(() => find(SELECTORS.logsWidget));
  const picked = await pickMenuPath(path) && (await waitFor(() => find(SELECTORS.logsWidget) === null)) !== null;
  const { preset, definitions, layout } = store();
  const expected = widgetsIn(presetLayout(preset, definitions).dock);
  const reset = picked && !isWidgetOpen(layout, LOGS_WIDGET_ID) && JSON.stringify(widgetsIn(layout.dock)) === JSON.stringify(expected);
  tour.check('reset-layout-applies', reset, `Reset layout put the widgets back to the app default (${expected.join(', ') || 'none open'})`, `Reset layout left ${widgetsIn(layout.dock).join(', ')} docked instead of ${expected.join(', ') || 'none'}`);
  await tour.capture('widgets-reset-layout');
  store().setLayout(before);
};

export { checkResetLayout };
