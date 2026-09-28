/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { SettingsStore } from '../../../stores/settings-store.type';
import { resetAllSessionStores } from '../../../stores/reset-all-session-stores';
import { useProfilesStore } from '../../../stores/useProfilesStore';

const useProfileHydration = <S extends object>(settingsStore: SettingsStore<S>): void => {
  const profileId = useProfilesStore((s) => s.active?.id ?? null);

  useEffect(() => {
    resetAllSessionStores();
    if (profileId) void settingsStore.getState().hydrate(profileId);
    else settingsStore.getState().reset();
  }, [profileId, settingsStore]);
};

export { useProfileHydration };
