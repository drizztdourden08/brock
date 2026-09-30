/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import { formatRelativeTime } from '@drizztdourden08/brock-core';
import { InlineCreateForm, ProfilePicker } from '@drizztdourden08/tessera/composites';
import { useProfiles } from '../../stores/useProfiles';
import { useNavigation } from '../../navigation/useNavigation';
import { getAppLog } from '../../log/get-app-log';
import type { ProfilesScreenProps } from './ProfilesScreen.type';

const ProfilesScreen = (props: ProfilesScreenProps) => {
  const { subtitleOf, extraFields, canSubmit = true, createOptions } = props;
  const { profiles, active, loaded, select, create, removeConfirmed } = useProfiles();
  const { close } = useNavigation();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showForm = creating || (loaded && profiles.length === 0);

  const items = useMemo(() => profiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    meta: subtitleOf?.(profile),
    aside: formatRelativeTime(profile.lastPlayed),
  })), [profiles, subtitleOf]);

  const handleSelect = useCallback(async (profile: Profile) => {
    await select(profile);
    close();
  }, [select, close]);

  const handleCreate = useCallback(async (name: string) => {
    setError(null);
    try {
      const profile = await create({ name, ...(createOptions?.() ?? {}) });
      getAppLog().log('app', `Profile created: ${profile.name}`);
      setCreating(false);
      await handleSelect(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [create, createOptions, handleSelect]);

  const byId = (id: string): Profile | undefined => profiles.find((profile) => profile.id === id);

  const form = showForm ? (
    <InlineCreateForm
      placeholder="Profile name"
      onCreate={(name) => void handleCreate(name)}
      onCancel={profiles.length > 0 ? () => { setCreating(false); setError(null); } : undefined}
      extraFields={extraFields}
      canSubmit={canSubmit}
      error={error}
    />
  ) : undefined;

  return (
    <ProfilePicker
      title={profiles.length === 0 ? 'Create a profile to get started' : 'Pick a profile, or create another'}
      profiles={items}
      selectedId={active?.id ?? null}
      onSelect={(id) => { const profile = byId(id); if (profile) void handleSelect(profile); }}
      onDelete={(id) => { const profile = byId(id); if (profile) removeConfirmed(profile); }}
      create={form}
      onNew={() => setCreating(true)}
    />
  );
};

export { ProfilesScreen };
