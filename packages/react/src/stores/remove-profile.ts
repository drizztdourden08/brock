/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { nav } from '../navigation/nav';
import { profileRemoval } from './profile-removal';
import { PROFILES_SCREEN } from './profiles.constants';
import { useProfilesStore } from './useProfilesStore';

const removeProfile = async (profile: Profile): Promise<boolean> => {
  if (!(await profileRemoval.allows(profile))) return false;
  const wasActive = useProfilesStore.getState().active?.id === profile.id;
  await useProfilesStore.getState().remove(profile.id);
  if (wasActive && useProfilesStore.getState().active === null) nav.open(PROFILES_SCREEN);
  return true;
};

export { removeProfile };
