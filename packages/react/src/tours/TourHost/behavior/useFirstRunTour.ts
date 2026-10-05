/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { isAutomationLaunch } from '../../../host/is-automation-launch';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { tours } from '../../tours';
import { FIRST_RUN_DELAY_MS } from '../../tours.constants';
import { useTourStore } from '../../useTourStore';

const useFirstRunTour = (ready: boolean): void => {
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const loadedFor = useTourStore((s) => s.progressFor);
  const count = useTourStore((s) => s.tours.length);

  useEffect(() => {
    if (!ready || profileId === null || loadedFor !== profileId || count === 0 || isAutomationLaunch()) return undefined;
    const timer = setTimeout(tours.startFirstRun, FIRST_RUN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready, profileId, loadedFor, count]);
};

export { useFirstRunTour };
