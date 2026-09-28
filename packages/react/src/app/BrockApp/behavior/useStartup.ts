/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { getAppLog } from '../../../log/get-app-log';
import { instanceProfile } from '../../../host/instance-profile';
import { nav } from '../../../navigation/nav';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { PROFILES_SCREEN } from '../BrockApp.constants';

const useStartup = (): { settled: boolean } => {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const log = getAppLog();
    const run = async () => {
      try {
        const store = useProfilesStore.getState();
        const profiles = await store.refresh();
        const { lastProfileId } = useProfilesStore.getState();
        const wanted = instanceProfile();

        if (wanted !== null) {
          const pinned = profiles.find((p) => p.id === wanted) ?? profiles.find((p) => p.name === wanted);
          if (!pinned) {
            log.error(`Instance profile "${wanted}" not found`);
            nav.open(PROFILES_SCREEN);
            return;
          }
          log.log('app', `Instance profile: ${pinned.name}`);
          store.setActive(pinned);
          return;
        }

        const [first] = profiles;
        if (first === undefined) {
          log.log('app', 'No profiles found, showing the profiles screen');
          nav.open(PROFILES_SCREEN);
        } else if (profiles.length === 1) {
          log.log('app', `Single profile: ${first.name}`);
          store.setActive(first);
        } else {
          const last = lastProfileId ? profiles.find((p) => p.id === lastProfileId) : undefined;
          if (last) {
            log.log('app', `Resuming last profile: ${last.name}`);
            store.setActive(last);
          } else {
            nav.open(PROFILES_SCREEN);
          }
        }
      } catch (err) {
        log.error(`Startup failed: ${err instanceof Error ? err.message : String(err)}`);
        nav.open(PROFILES_SCREEN);
      } finally {
        setSettled(true);
      }
    };
    void run();
  }, []);

  return { settled };
};

export { useStartup };
