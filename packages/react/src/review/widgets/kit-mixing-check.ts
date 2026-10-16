/* @layer renderer-shell @kind logic */
import { isWidgetOpen, widgetsIn } from '@drizztdourden08/tessera/composites';
import { kitViewOf } from '../../widgets/kits/kit-view-of';
import { useWidgetKitStore } from '../../widgets/kits/useWidgetKitStore';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { KIT_NORMAL_WIDGET, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, kitSelectors } from './kit-review.constants';

const kitIds = (): string[] => {
  const view = kitViewOf(REVIEW_KIT_ID, useWidgetKitStore.getState());
  return view ? [...widgetsIn(view.layout.dock), ...view.layout.floating.map((each) => each.id)] : [];
};

const compact = (): boolean => REVIEW_KIT_MEMBERS.every((id) => find(`${kitSelectors.widget(id)}.widget--chrome-compact`) !== null);

const checkKitMixing = async (tour: StepTour): Promise<void> => {
  const [member] = REVIEW_KIT_MEMBERS;
  widgetKits.close();
  await waitFor(kitDrawn.none);
  widgets.open(member);
  const opened = await waitFor(kitDrawn.all);
  const leaked = isWidgetOpen(useWidgetLayoutStore.getState().layout, member);
  tour.check('kit-widget-opens-kit', opened !== null && !leaked && widgetKits.isOpen(REVIEW_KIT_ID), 'widgets.open on a kit widget opened its kit with it and left the normal layout alone', 'widgets.open on a kit widget did not open its kit, or put it in the normal layout');
  const members: readonly string[] = REVIEW_KIT_MEMBERS;
  const ids = kitIds();
  const own = ids.length > 0 && ids.every((id) => members.includes(id)) && !ids.includes(KIT_NORMAL_WIDGET);
  tour.check('kit-holds-only-its-widgets', own, `the kit layout holds only its own widgets (${ids.join(', ')})`, `the kit layout holds a widget that is not in the kit (${ids.join(', ')})`);
  tour.check('kit-widget-chrome', compact(), 'kit widgets with chrome: \'compact\' draw the compact title strip', 'a kit widget with chrome: \'compact\' drew the full title bar');
};

export { checkKitMixing };
