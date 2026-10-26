/* @layer renderer-shell @kind logic */
import { getAppLog } from '../../log/get-app-log';
import { instanceProfile } from '../../host/instance-profile';
import { nav } from '../../navigation/nav';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { PROFILES_SCREEN } from '../../app/BrockApp/BrockApp.constants';
import { DEFAULT_PROFILE_NAME } from '../../stores/profiles.constants';
import type { RendererBootTask } from '../renderer-boot.type';

const openPicker = (reason: string): string => {
  nav.open(PROFILES_SCREEN);
  return reason;
};

const createFirst = async (name: string, label: string): Promise<string> => {
  const store = useProfilesStore.getState();
  const profile = await store.create({ name });
  store.setActive(profile);
  return `${label} ${profile.name}`;
};

const noProfile = (initialProfile: string | undefined): Promise<string> | string =>
  initialProfile === undefined ? openPicker('No profiles yet') : createFirst(initialProfile, 'Initial profile');

const pickProfile = async (initialProfile: string | undefined): Promise<string> => {
  const store = useProfilesStore.getState();
  const profiles = await store.refresh();
  const { lastProfileId } = useProfilesStore.getState();
  const wanted = instanceProfile();

  if (wanted !== null) {
    const pinned = profiles.find((p) => p.id === wanted) ?? profiles.find((p) => p.name === wanted);
    if (!pinned) {
      getAppLog().error(`Instance profile "${wanted}" not found`);
      return openPicker(`Profile ${wanted} not found`);
    }
    store.setActive(pinned);
    return `Instance profile ${pinned.name}`;
  }

  const [first] = profiles;
  if (first === undefined) return noProfile(initialProfile);
  if (profiles.length === 1) {
    store.setActive(first);
    return `Profile ${first.name}`;
  }
  const last = lastProfileId ? profiles.find((p) => p.id === lastProfileId) : undefined;
  if (!last) return openPicker(`${profiles.length} profiles to choose from`);
  store.setActive(last);
  return `Resuming ${last.name}`;
};

const implicitProfile = async (): Promise<string> => {
  const store = useProfilesStore.getState();
  const [existing] = await store.refresh();
  if (existing === undefined) return createFirst(DEFAULT_PROFILE_NAME, 'Single profile');
  store.setActive(existing);
  return `Single profile ${existing.name}`;
};

const profilesTask: RendererBootTask = {
  id: 'profiles',
  label: 'Reading profiles',
  run: async ({ report, product }) => {
    const outcome = await (product.singleProfile === true ? implicitProfile() : pickProfile(product.initialProfile));
    getAppLog().log('app', outcome);
    report(1, outcome);
  },
};

export { profilesTask };
