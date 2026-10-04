/* @layer renderer-shell @kind component */
import { ManagedList } from '@drizztdourden08/tessera/composites';
import { Box, Callout, SectionHeader } from '@drizztdourden08/tessera/primitives';
import { useProfilesPanel } from './behavior/useProfilesPanel';
import { ProfilesPanelCreate } from './sub-components/ProfilesPanelCreate';
import { PROFILE_ROW, PROFILES_PANEL_TEXT } from './ProfilesPanel.constants';
import type { ProfilesPanelItem, ProfilesPanelProps } from './ProfilesPanel.type';
import './ProfilesPanel.css';

const ProfilesPanel = (props: ProfilesPanelProps) => {
  const {
    title, profiles, onCreate, onRename, onDelete, createOpen = false, extraFields, canSubmit, placeholder = PROFILES_PANEL_TEXT.placeholder,
    newLabel = PROFILES_PANEL_TEXT.newProfile, className = '',
  } = props;
  const panel = useProfilesPanel(props);
  const create = onCreate && ((close: () => void) => (
    <ProfilesPanelCreate
      close={close}
      required={createOpen}
      error={panel.createError}
      extraFields={extraFields}
      canSubmit={canSubmit}
      placeholder={placeholder}
      onSubmit={panel.submitCreate}
    />
  ));

  return (
    <Box className={`profiles-panel${className ? ` ${className}` : ''}`} {...panel.pressHandlers}>
      <SectionHeader title={title} />
      {panel.renameError && <Box role="alert"><Callout tone="danger">{panel.renameError}</Callout></Box>}
      <ManagedList<ProfilesPanelItem>
        title={PROFILES_PANEL_TEXT.list}
        items={profiles}
        getId={PROFILE_ROW.getId}
        getName={PROFILE_ROW.getName}
        render={PROFILE_ROW.render}
        selectedId={panel.pickedId}
        onSelect={panel.pick}
        create={create}
        createOpen={panel.createShown}
        onCreateOpenChange={panel.openChange}
        createLabel={newLabel}
        onRename={onRename && panel.submitRename}
        onDelete={onDelete}
        empty={PROFILES_PANEL_TEXT.empty}
      />
    </Box>
  );
};

export { ProfilesPanel };
