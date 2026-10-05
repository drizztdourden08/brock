/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { isAutomationLaunch } from '../../../host/is-automation-launch';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { tours } from '../../tours';
import { FIRST_RUN_DELAY_MS } from '../../tours.constants';
import { useTourStore } from '../../useTourStore';

const useFirstRunTour = (ready: boolean): void => {
  const hasProfile = useProfilesStore((s) => s.active !== null);
  const loaded = useTourStore((s) => s.loaded);
  const firstUse = useTourStore((s) => s.firstUse);

  useEffect(() => {
    if (!ready || !hasProfile || !loaded || !firstUse || isAutomationLaunch()) return undefined;
    const timer = setTimeout(tours.startFirstRun, FIRST_RUN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready, hasProfile, loaded, firstUse]);
};

export { useFirstRunTour };
