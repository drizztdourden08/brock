/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { isAutomationLaunch } from '../../../host/is-automation-launch';
import { screenPersistence } from '../../../screens/screen-persistence';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useBrock } from '../../useBrock';

const useScreenPersistence = (): void => {
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const { homeScreen } = useBrock();
  const registry = useScreenRegistry();

  useEffect(() => {
    let live = true;
    const restore = { navigation: !isAutomationLaunch(), homeScreen, known: (id: string) => registry.has(id) };
    void screenPersistence.load(profileId, restore, () => live);
    return () => { live = false; };
  }, [profileId]);

  useEffect(screenPersistence.watch, []);
};

export { useScreenPersistence };
