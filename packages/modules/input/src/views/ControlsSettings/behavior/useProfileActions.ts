/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { newProfile } from '../../../bindings/profile/new-profile';
import type { InputProfile } from '../../../bindings/input-profile.type';
import type { UseProfileStateArgs } from '../ControlsSettings.type';
import { useProfileState } from './useProfileState';

const useProfileActions = (args: UseProfileStateArgs) => {
  const { store, keyboardDefaults } = args;
  const { profiles, activeProfile, setActiveProfile, persistProfiles, selectProfile, updateActiveProfile } =
    useProfileState(args);
  const [deleteTarget, setDeleteTarget] = useState<InputProfile | null>(null);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  const handleCreate = useCallback(() => {
    const created = newProfile(profiles.length, keyboardDefaults);
    void persistProfiles([...profiles, created]);
    selectProfile(created);
    setNewlyCreatedId(created.id);
  }, [profiles, keyboardDefaults, persistProfiles, selectProfile]);

  const handleRename = useCallback((profile: InputProfile, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === profile.name) return;

    const renamed: InputProfile = { ...profile, name: trimmed, modifiedAt: Date.now() };
    if (activeProfile?.id === renamed.id) {
      setActiveProfile(renamed);
      store.activate(renamed);
    }
    void persistProfiles(profiles.map((p) => (p.id === renamed.id ? renamed : p)));
  }, [store, profiles, activeProfile, persistProfiles, setActiveProfile]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    const remaining = profiles.filter((p) => p.id !== deleteTarget.id);
    void persistProfiles(remaining);
    const fallback = remaining[0];
    if (activeProfile?.id === deleteTarget.id && fallback) selectProfile(fallback);
    setDeleteTarget(null);
  }, [deleteTarget, profiles, activeProfile, persistProfiles, selectProfile]);

  return {
    profiles,
    activeProfile,
    deleteTarget,
    newlyCreatedId,
    setDeleteTarget,
    selectProfile,
    persistProfiles,
    updateActiveProfile,
    handleCreate,
    handleRename,
    handleDeleteConfirm,
  };
};

export { useProfileActions };
