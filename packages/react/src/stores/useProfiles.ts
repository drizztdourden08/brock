/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import { dialogs } from './dialogs';
import type { UseProfilesResult } from './profiles.type';
import { removeProfile } from './remove-profile';
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

  const rename = useCallback((profile: Profile, name: string) => renameNow(profile.id, name), [renameNow]);

  const remove = useCallback((profile: Profile) => {
    dialogs.confirmDelete(
      'Delete profile',
      `Delete "${profile.name}" and everything saved in it? This cannot be undone.`,
      () => { void removeProfile(profile); },
    );
  }, []);

  return { profiles, active, lastProfileId, loaded, select, create, rename, remove, removeConfirmed: removeProfile, refresh };
};

export { useProfiles };
