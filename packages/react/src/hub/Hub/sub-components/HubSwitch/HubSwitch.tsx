/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { WorkspaceSwitch } from '../../../../shell/WorkspaceSwitch/WorkspaceSwitch';
import type { HubSwitchProps } from './HubSwitch.type';

const HubSwitch = (props: HubSwitchProps) => {
  const { hubs, current, onSelect } = props;
  const items = useMemo(() => hubs.map((hub) => ({ id: hub.id, label: hub.title, icon: hub.icon })), [hubs]);
  return (
    <Box className="hub-screen__switch">
      <WorkspaceSwitch items={items} current={current} onSelect={onSelect} label="Switch hub" />
    </Box>
  );
};

export { HubSwitch };
