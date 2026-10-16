/* @layer renderer-shell @kind logic */
import { isWidgetOpen, widgetsIn } from '@drizztdourden08/tessera/composites';
import { kitViewOf } from '../../widgets/kits/kit-view-of';
import { useWidgetKitStore } from '../../widgets/kits/useWidgetKitStore';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { KIT_NORMAL_WIDGET, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS } from './kit-review.constants';

const kitIds = (): string[] => {
  const view = kitViewOf(REVIEW_KIT_ID, useWidgetKitStore.getState());
  return view ? [...widgetsIn(view.layout.dock), ...view.layout.floating.map((each) => each.id)] : [];
};

const checkKitMixing = async (tour: StepTour): Promise<void> => {
  const [member] = REVIEW_KIT_MEMBERS;
  widgets.open(member);
  const leaked = isWidgetOpen(useWidgetLayoutStore.getState().layout, member);
  tour.check('kit-widget-stays-in-kit', !leaked, 'widgets.open on a kit widget left the normal layout alone', 'a kit widget opened in the normal layout');
  widgetKits.open(REVIEW_KIT_ID);
  await waitFor(kitDrawn.all);
  const members: readonly string[] = REVIEW_KIT_MEMBERS;
  const ids = kitIds();
  const own = ids.length > 0 && ids.every((id) => members.includes(id)) && !ids.includes(KIT_NORMAL_WIDGET);
  tour.check('kit-holds-only-its-widgets', own, `the kit layout holds only its own widgets (${ids.join(', ')})`, `the kit layout holds a widget that is not in the kit (${ids.join(', ')})`);
};

export { checkKitMixing };
