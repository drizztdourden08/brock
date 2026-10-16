/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { profileViews } from '../../widgets/profile-views';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { until } from '../dom/until';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { kitDrawn } from './kit-drawn';
import { REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, kitSelectors } from './kit-review.constants';
import { storedKitView } from './stored-kit-view';
import { storedLayout } from './stored-layout';

const [LEFT, RIGHT] = REVIEW_KIT_MEMBERS;

const oneLeft = (): boolean => find(kitSelectors.widget(LEFT)) === null && find(kitSelectors.widget(RIGHT)) !== null && find(kitSelectors.bar(REVIEW_KIT_ID)) !== null;

const closeLeft = (): void => {
  const buttons = find(kitSelectors.widget(LEFT))?.querySelectorAll<HTMLElement>('.widget__titlebar-actions button');
  const last = buttons?.item(buttons.length - 1);
  if (last) click(last);
};

const saved = async (): Promise<boolean> => {
  const view = await storedKitView(REVIEW_KIT_ID);
  return view !== null && !isWidgetOpen(view.layout, LEFT) && isWidgetOpen(view.layout, RIGHT);
};

const apart = async (): Promise<boolean> => {
  const normal = await storedLayout();
  return normal === null || REVIEW_KIT_MEMBERS.every((id) => !isWidgetOpen(normal, id));
};

const checkKitLayout = async (tour: StepTour): Promise<void> => {
  closeLeft();
  const alone = await waitFor(oneLeft);
  tour.check('kit-widget-closes-alone', alone !== null, 'a kit widget\'s own close button closed that widget alone and the kit stayed open', 'a kit widget\'s close button did not close it alone');
  profileViews.flush();
  tour.check('kit-layout-saved', await until(saved), 'the kit layout was saved with the profile under widgetKits, the closed widget out of it', 'the kit layout did not reach ui-views.json');
  tour.check('kit-layout-apart', await apart(), 'the normal saved layout holds none of the kit widgets', 'a kit widget leaked into the normal saved layout');
  widgetKits.close();
  await waitFor(kitDrawn.none);
  widgetKits.open(REVIEW_KIT_ID);
  const restored = await waitFor(oneLeft);
  tour.check('kit-layout-restored', restored !== null, 'reopening the kit brought back its own layout, the closed widget still closed', 'reopening the kit did not restore its own layout');
  widgetKits.reset(REVIEW_KIT_ID);
  await waitFor(kitDrawn.all);
};

export { checkKitLayout };
