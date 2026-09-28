/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import { Box, Button, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import { useProfiles } from '../../stores/useProfiles';
import { useNavigation } from '../../navigation/useNavigation';
import { getAppLog } from '../../log/get-app-log';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { CreateProfileForm } from '../CreateProfileForm/CreateProfileForm';
import type { ProfilesScreenProps } from './ProfilesScreen.type';
import './ProfilesScreen.css';

const ProfilesScreen = (props: ProfilesScreenProps) => {
  const { subtitleOf, extraFields, canSubmit = true, createOptions } = props;
  const { profiles, active, loaded, select, create, remove } = useProfiles();
  const { close } = useNavigation();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showForm = creating || (loaded && profiles.length === 0);

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

  return (
    <Box className="profiles-screen">
      <SectionHeader
        title="Profiles"
        subtitle={profiles.length === 0 ? 'Create a profile to get started.' : 'Pick a profile, or create another.'}
        action={!showForm && <Button variant="primary" size="sm" onClick={() => setCreating(true)}>New profile</Button>}
      />
      {showForm && (
        <Box className="profiles-screen__form">
          <CreateProfileForm
            onCreate={handleCreate}
            onCancel={profiles.length > 0 ? () => { setCreating(false); setError(null); } : undefined}
            extraFields={extraFields}
            canSubmit={canSubmit}
            error={error}
          />
        </Box>
      )}
      <Stack gap="sm" className="profiles-screen__list">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            subtitle={subtitleOf?.(profile)}
            selected={active?.id === profile.id}
            onSelect={handleSelect}
            onDelete={remove}
          />
        ))}
      </Stack>
    </Box>
  );
};

export { ProfilesScreen };
