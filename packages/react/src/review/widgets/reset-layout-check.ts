/* @layer renderer-shell @kind logic */
import { isWidgetOpen, widgetsIn } from '@drizztdourden08/tessera/composites';
import { LOGS_WIDGET_ID } from '../../widgets/built-in/LogsWidget/LogsWidget.constants';
import { presetLayout } from '../../widgets/preset-layout';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { RESET_LAYOUT_ENTRY } from '../../widgets/widget.constants';
import { widgets } from '../../widgets/widgets';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { closeMenu } from '../menu/close-menu';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';

const store = () => useWidgetLayoutStore.getState();

const armedItem = (): HTMLElement | null => find(SELECTORS.askingMenuItem);

const armReset = async (tour: StepTour, path: readonly string[]): Promise<HTMLElement | null> => {
  const picked = await pickMenuPath(path);
  const armed = picked ? await waitFor(armedItem) : null;
  const kept = find(SELECTORS.logsWidget) !== null;
  const asked = armed?.querySelector(SELECTORS.menuAsk)?.textContent.trim() ?? '';
  tour.check('reset-layout-asks', armed !== null && kept, `the first click turned the entry into "${asked}" and left the layout as it was`, armed === null ? 'the first click did not ask for a second one' : 'the first click already reset the layout');
  if (armed) await tour.capture('widgets-reset-layout-asks');
  return armed;
};

const confirmReset = async (tour: StepTour, path: readonly string[]): Promise<boolean> => {
  const armed = await armReset(tour, path);
  if (armed) click(armed);
  const picked = armed !== null && (await waitFor(() => find(SELECTORS.logsWidget) === null)) !== null;
  await closeMenu();
  return picked;
};

const checkResetLayout = async (tour: StepTour): Promise<void> => {
  const path = menuPathTo(tour.env.menu, (item) => item.key === RESET_LAYOUT_ENTRY.key);
  tour.check('reset-layout-entry', path !== null && path.at(-1) === RESET_LAYOUT_ENTRY.label, `the Widgets menu ends with ${path?.join(' > ') ?? ''}`, 'the menu has no Reset layout entry');
  if (!path) return;
  const before = store().layout;
  widgets.open(LOGS_WIDGET_ID);
  await waitFor(() => find(SELECTORS.logsWidget));
  const picked = await confirmReset(tour, path);
  const { preset, definitions, layout } = store();
  const expected = widgetsIn(presetLayout(preset, definitions).dock);
  const reset = picked && !isWidgetOpen(layout, LOGS_WIDGET_ID) && JSON.stringify(widgetsIn(layout.dock)) === JSON.stringify(expected);
  tour.check('reset-layout-applies', reset, `the second click put the widgets back to the app default (${expected.join(', ') || 'none open'})`, `Reset layout left ${widgetsIn(layout.dock).join(', ')} docked instead of ${expected.join(', ') || 'none'}`);
  await tour.capture('widgets-reset-layout');
  store().setLayout(before);
};

export { checkResetLayout };
