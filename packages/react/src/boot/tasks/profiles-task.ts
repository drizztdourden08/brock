/* @layer renderer-shell @kind logic */
import { getAppLog } from '../../log/get-app-log';
import { instanceProfile } from '../../host/instance-profile';
import { nav } from '../../navigation/nav';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { PROFILES_SCREEN } from '../../app/BrockApp/BrockApp.constants';
import type { RendererBootTask } from '../renderer-boot.type';

const openPicker = (reason: string): string => {
  nav.open(PROFILES_SCREEN);
  return reason;
};

const pickProfile = async (): Promise<string> => {
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
  if (first === undefined) return openPicker('No profiles yet');
  if (profiles.length === 1) {
    store.setActive(first);
    return `Profile ${first.name}`;
  }
  const last = lastProfileId ? profiles.find((p) => p.id === lastProfileId) : undefined;
  if (!last) return openPicker(`${profiles.length} profiles to choose from`);
  store.setActive(last);
  return `Resuming ${last.name}`;
};

const profilesTask: RendererBootTask = {
  id: 'profiles',
  label: 'Reading profiles',
  run: async ({ report }) => {
    const outcome = await pickProfile();
    getAppLog().log('app', outcome);
    report(1, outcome);
  },
};

export { profilesTask };
