/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { Box, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { SidePanel } from '@drizztdourden08/tessera/composites';
import { sideSlotClass } from '../behavior/side-slot-class';
import { useStoredFold } from '../behavior/useStoredFold';
import { PROFILES_FOLD_KEY, PROFILES_WIDTH_KEY, SIDE_PANEL_SIZE } from '../ControlsSettings.constants';
import { NarrowPanel } from './NarrowPanel';
import { ProfilesBody } from './ProfilesBody';
import { SidebarProfileButton } from './SidebarProfileButton';
import type { ControlsProfilesProps } from './ControlsProfiles.type';

const ControlsProfiles = (props: ControlsProfilesProps) => {
  const { profiles, activeId, labels, narrow, onSelect, onCreate } = props;
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

  const body = <ProfilesBody {...props} />;
  if (narrow) return <NarrowPanel action={add}>{body}</NarrowPanel>;

  return (
    <Box className={sideSlotClass('start', collapsed)}>
      <SidePanel
        title={labels.profilesTitle}
        {...SIDE_PANEL_SIZE}
        storageKey={PROFILES_WIDTH_KEY}
        action={add}
        railItems={rail}
        collapsed={collapsed}
        onCollapsedChange={toggle}
        containers={[{ title: labels.profileList, content: body }]}
      />
    </Box>
  );
};

export { ControlsProfiles };
