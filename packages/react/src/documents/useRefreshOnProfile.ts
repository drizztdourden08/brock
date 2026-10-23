/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useProfilesStore } from '../stores/useProfilesStore';

const useRefreshOnProfile = (refresh: () => Promise<void>): void => {
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  useEffect(() => {
    void refresh();
  }, [profileId, refresh]);
};

export { useRefreshOnProfile };
