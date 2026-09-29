/* @layer renderer-shell @kind logic */
import { useProfilesStore } from '../../stores/useProfilesStore';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { isClosed } from '../dom/is-closed';
import { typeText } from '../dom/type-text';
import { waitFor } from '../dom/wait-for';
import { PROFILES_SCREEN, REVIEW_PROFILE_NAME, SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { openScreen } from './open-screen';

const enabledSubmit = (): HTMLButtonElement | null => {
  const button = find(SELECTORS.profileSubmit);
  return button instanceof HTMLButtonElement && !button.disabled ? button : null;
};

const profileStep: ReviewStep = {
  name: 'profile',
  run: async (tour) => {
    const current = useProfilesStore.getState().active;
    if (current) {
      tour.check('profile-active', true, `profile "${current.name}" is already active`, '');
      return;
    }
    if (!find(SELECTORS.profileInput)) await openScreen(tour.env, PROFILES_SCREEN);
    const input = await waitFor(() => find(SELECTORS.profileInput));
    if (!(input instanceof HTMLInputElement)) {
      tour.check('profile-form', false, '', 'no profile is active and no create profile form is on screen');
      return;
    }
    await tour.capture('first-run');
    typeText(input, REVIEW_PROFILE_NAME);
    const submit = await waitFor(enabledSubmit);
    if (submit) click(submit);
    const active = await waitFor(() => useProfilesStore.getState().active);
    tour.check('profile-created', active !== null, `the create form made profile "${active?.name ?? ''}" active`, 'the create form did not make a profile active');
    const closed = await waitFor(isClosed);
    tour.check('profiles-closes', closed !== null, 'the profiles screen closed after the pick', 'the profiles screen stayed open after the pick');
  },
};

export { profileStep };
