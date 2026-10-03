/* @layer renderer-shell @kind component */
import { Box, Stack } from '@drizztdourden08/tessera/primitives';
import { useProfilesPanel } from './behavior/useProfilesPanel';
import { ProfilesPanelCreate } from './sub-components/ProfilesPanelCreate';
import { ProfilesPanelRow } from './sub-components/ProfilesPanelRow';
import type { ProfilesPanelProps } from './ProfilesPanel.type';
import './ProfilesPanel.css';

const ProfilesPanel = (props: ProfilesPanelProps) => {
  const {
    title, profiles, selectedId = null, onSelect, onCreate, onRename, onDelete, createOpen = false, extraFields, canSubmit, placeholder, newLabel,
    className = '',
  } = props;
  const panel = useProfilesPanel(props);

  return (
    <Box className={`profiles-panel${className ? ` ${className}` : ''}`}>
      <ProfilesPanelCreate
        title={title}
        canCreate={onCreate !== undefined}
        formShown={panel.formShown}
        createOpen={createOpen}
        error={panel.createError}
        extraFields={extraFields}
        canSubmit={canSubmit}
        placeholder={placeholder}
        newLabel={newLabel}
        onOpen={panel.openCreate}
        onSubmit={panel.submitCreate}
        onCancel={panel.cancelCreate}
      />
      <Stack gap="sm" role="list" className="profiles-panel__list">
        {profiles.map((profile) => (
          <ProfilesPanelRow
            key={profile.id}
            profile={profile}
            selected={profile.id === selectedId}
            renaming={profile.id === panel.renamingId}
            renameError={panel.renameError}
            onSelect={onSelect}
            onDelete={onDelete}
            onStartRename={onRename && panel.startRename}
            onSubmitRename={panel.submitRename}
            onCancelRename={panel.cancelRename}
          />
        ))}
      </Stack>
    </Box>
  );
};

export { ProfilesPanel };
