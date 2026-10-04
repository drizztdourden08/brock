/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import { formatRelativeTime } from '@drizztdourden08/brock-core';
import { ProfilesPanel } from '../../compounds/ProfilesPanel';
import { useProfiles } from '../../stores/useProfiles';
import { useNavigation } from '../../navigation/useNavigation';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { PROFILES_SCREEN } from '../../app/BrockApp/BrockApp.constants';
import { getAppLog } from '../../log/get-app-log';
import type { ProfilesScreenProps } from './ProfilesScreen.type';

const ProfilesScreen = (props: ProfilesScreenProps) => {
  const { subtitleOf, extraFields, canSubmit = true, createOptions } = props;
  const { profiles, active, loaded, select, create, rename, removeConfirmed } = useProfiles();
  const { close } = useNavigation();

  const items = useMemo(() => profiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    meta: subtitleOf?.(profile),
    aside: formatRelativeTime(profile.lastPlayed),
  })), [profiles, subtitleOf]);

  const byId = useCallback((id: string): Profile | undefined => profiles.find((profile) => profile.id === id), [profiles]);

  const handleSelect = useCallback(async (profile: Profile) => {
    await select(profile);
    if (useNavigationStore.getState().active === PROFILES_SCREEN) close();
  }, [select, close]);

  const handleCreate = useCallback(async (name: string) => {
    const profile = await create({ name, ...(createOptions?.() ?? {}) });
    getAppLog().log('app', `Profile created: ${profile.name}`);
    await handleSelect(profile);
  }, [create, createOptions, handleSelect]);

  const handleRename = useCallback(async (id: string, name: string) => {
    const profile = byId(id);
    if (!profile) return;
    await rename(profile, name);
    getAppLog().log('app', `Profile renamed: ${profile.name} to ${name}`);
  }, [byId, rename]);

  return (
    <ProfilesPanel
      title={profiles.length === 0 ? 'Create a profile to get started' : 'Pick a profile, or create another'}
      profiles={items}
      selectedId={active?.id ?? null}
      onSelect={(id) => { const profile = byId(id); if (profile) void handleSelect(profile); }}
      onCreate={handleCreate}
      onRename={handleRename}
      onDelete={(id) => { const profile = byId(id); if (profile) removeConfirmed(profile); }}
      createOpen={loaded && profiles.length === 0}
      extraFields={extraFields}
      canSubmit={canSubmit}
    />
  );
};

export { ProfilesScreen };
