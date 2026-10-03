/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import { nav } from '../navigation/nav';
import { dialogs } from './dialogs';
import { PROFILES_SCREEN } from './profiles.constants';
import type { UseProfilesResult } from './profiles.type';
import { useProfilesStore } from './useProfilesStore';

const useProfiles = (): UseProfilesResult => {
  const profiles = useProfilesStore((s) => s.profiles);
  const active = useProfilesStore((s) => s.active);
  const lastProfileId = useProfilesStore((s) => s.lastProfileId);
  const loaded = useProfilesStore((s) => s.loaded);
  const select = useProfilesStore((s) => s.select);
  const create = useProfilesStore((s) => s.create);
  const refresh = useProfilesStore((s) => s.refresh);
  const renameNow = useProfilesStore((s) => s.rename);
  const removeNow = useProfilesStore((s) => s.remove);

  const removeConfirmed = useCallback((profile: Profile) => {
    const wasActive = useProfilesStore.getState().active?.id === profile.id;
    void removeNow(profile.id).then(() => { if (wasActive) nav.open(PROFILES_SCREEN); });
  }, [removeNow]);

  const rename = useCallback((profile: Profile, name: string) => renameNow(profile.id, name), [renameNow]);

  const remove = useCallback((profile: Profile) => {
    dialogs.confirmDelete(
      'Delete profile',
      `Delete "${profile.name}" and everything saved in it? This cannot be undone.`,
      () => removeConfirmed(profile),
    );
  }, [removeConfirmed]);

  return { profiles, active, lastProfileId, loaded, select, create, rename, remove, removeConfirmed, refresh };
};

export { useProfiles };
