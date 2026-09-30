/* @layer renderer-shell @kind logic */
import { placementOf } from '@drizztdourden08/tessera/composites';
import { requireHostApi } from '../../host/require-host-api';
import { useWidgetPrefStore } from '../../stores/useWidgetPrefStore';
import { profileViews } from '../../widgets/profile-views';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { until } from '../dom/until';
import { REVIEW_PREF_KEY } from '../review.constants';
import type { StepTour } from '../review.type';
import { poppedWindowOf } from './popped-window-of';
import { storedWidgetPref } from './stored-widget-pref';

const appPref = (id: string): unknown => useWidgetPrefStore.getState().byWidget[id]?.[REVIEW_PREF_KEY];

const checkPoppedPref = async (tour: StepTour, id: string): Promise<void> => {
  const api = requireHostApi();
  const before = useWidgetPrefStore.getState().byWidget[id] ?? {};
  const token = `review-${Date.now()}`;
  const relayed = await until(async () => {
    await api.reviewSetWidgetPref(id, REVIEW_PREF_KEY, token);
    return appPref(id) === token;
  });
  tour.check('pop-out-pref-relayed', relayed, `a pref set in the "${id}" window reached the app`, `a pref set in the "${id}" window never reached the app`);
  api.dockBackWidget(id);
  const docked = await until(async () => (await poppedWindowOf(id)) === null && placementOf(useWidgetLayoutStore.getState().layout, id) === 'docked');
  tour.check('pop-out-docks-back', docked, `the "${id}" window docked back into the app`, `the "${id}" window did not dock back`);
  profileViews.flush();
  const saved = await until(async () => (await storedWidgetPref(id, REVIEW_PREF_KEY)) === token);
  const kept = relayed && appPref(id) === token && saved;
  tour.check('pop-out-pref-kept', kept, 'the pref stayed set after the dock back and was saved with the profile', 'the pref was lost after the dock back or never saved with the profile');
  useWidgetPrefStore.getState().replaceWidget(id, before);
};

export { checkPoppedPref };
