/* @layer renderer-shell @kind logic */
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { isProfilesRoute } from '../../../stores/is-profiles-route';
import { PROFILES_SCREEN } from '../../../stores/profiles.constants';
import { useProfilesStore } from '../../../stores/useProfilesStore';

const hasProfile = (): boolean => useProfilesStore.getState().active !== null;

const profilelessEscape = {
  home: (): string | null => (hasProfile() ? null : PROFILES_SCREEN),
  holds: (): boolean => {
    if (hasProfile()) return false;
    const { active, params, parent, escapeTo } = useNavigationStore.getState();
    return parent === null && escapeTo === null && isProfilesRoute(active, params);
  },
};

export { profilelessEscape };
