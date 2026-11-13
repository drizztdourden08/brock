/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { Box, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { SidePanel } from '@drizztdourden08/tessera/composites';
import { sideSlotClass } from '../behavior/side-slot-class';
import { useStoredFold } from '../behavior/useStoredFold';
import { PROFILES_FOLD_KEY, PROFILES_WIDTH_KEY, SIDE_PANEL_SIZE } from '../ControlsSettings.constants';
import { InputProfileList } from './InputProfileList';
import { SidebarProfileButton } from './SidebarProfileButton';
import type { ControlsProfilesProps } from './ControlsProfiles.type';

const ControlsProfiles = (props: ControlsProfilesProps) => {
  const { profiles, activeId, newlyCreatedId, labels, narrow, onSelect, onDelete, onRename, onCreate } = props;
  const { collapsed, toggle, expand } = useStoredFold(PROFILES_FOLD_KEY, true);

  const handleAdd = useCallback(() => {
    expand();
    onCreate();
  }, [expand, onCreate]);

  const add = (
    <IconButton variant="ghost" size="sm" label={labels.newProfile} onClick={handleAdd}>
      <Icon name="plus" />
    </IconButton>
  );
  const rail = profiles.map((p) => (
    <SidebarProfileButton key={p.id} profile={p} active={p.id === activeId} onSelect={onSelect} />
  ));

  return (
    <Box className={sideSlotClass('start', collapsed, narrow)}>
      <SidePanel
        title={labels.profilesTitle}
        {...SIDE_PANEL_SIZE}
        storageKey={PROFILES_WIDTH_KEY}
        action={add}
        railItems={rail}
        collapsed={narrow ? false : collapsed}
        collapsible={!narrow}
        className={narrow ? 'controls-settings__side-fill' : undefined}
        onCollapsedChange={toggle}
        containers={[{
          title: labels.profileList,
          content: (
            <InputProfileList
              profiles={profiles}
              activeId={activeId}
              initialEditId={newlyCreatedId}
              labels={labels}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
            />
          ),
        }]}
      />
    </Box>
  );
};

export { ControlsProfiles };
