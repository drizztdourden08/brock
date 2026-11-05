/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { InputProfile } from '../../../bindings/input-profile.type';
import type { UseProfileStateArgs } from '../ControlsSettings.type';
import { useProfileLoader } from './useProfileLoader';

const useProfileState = ({ store, keyboardDefaults }: UseProfileStateArgs) => {
  const [profiles, setProfiles] = useState<InputProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<InputProfile | null>(null);

  useProfileLoader({ store, keyboardDefaults, setProfiles, setActiveProfile });

  useEffect(() => store.onActiveChange?.(setActiveProfile), [store]);

  const persistProfiles = useCallback(async (updated: InputProfile[]) => {
    setProfiles(updated);
    await store.save(updated);
  }, [store]);

  const selectProfile = useCallback((profile: InputProfile) => {
    setActiveProfile(profile);
    store.activate(profile);
  }, [store]);

  const updateActiveProfile = useCallback((updatedProfile: InputProfile) => {
    setActiveProfile(updatedProfile);
    store.activate(updatedProfile);
    void persistProfiles(profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));
  }, [store, profiles, persistProfiles]);

  return { profiles, activeProfile, setActiveProfile, persistProfiles, selectProfile, updateActiveProfile };
};

export { useProfileState };
