/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { isAutomationLaunch } from '../../../host/is-automation-launch';
import { screenPersistence } from '../../../screens/screen-persistence';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useBrock } from '../../useBrock';

const useScreenPersistence = (restoreNavigation = true): void => {
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const { homeScreen } = useBrock();
  const registry = useScreenRegistry();

  useEffect(() => {
    let live = true;
    const restore = { navigation: restoreNavigation && !isAutomationLaunch(), homeScreen, known: (id: string) => registry.has(id) };
    void screenPersistence.load(profileId, restore, () => live);
    return () => { live = false; };
  }, [profileId, restoreNavigation]);

  useEffect(screenPersistence.watch, []);
};

export { useScreenPersistence };
