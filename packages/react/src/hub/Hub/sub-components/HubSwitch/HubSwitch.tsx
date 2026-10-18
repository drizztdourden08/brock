/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useRoutePreloader } from '../../../../lazy/useRoutePreloader';
import { WorkspaceSwitch } from '../../../../shell/WorkspaceSwitch/WorkspaceSwitch';
import { useRegisteredHubs } from '../../behavior/useRegisteredHubs';
import type { HubSwitchProps } from './HubSwitch.type';
import './HubSwitch.css';

const HubSwitch = (props: HubSwitchProps) => {
  const { current, onSelect, status } = props;
  const hubs = useRegisteredHubs();
  const preload = useRoutePreloader();
  const items = useMemo(() => hubs.map((hub) => ({ id: hub.id, label: hub.title, icon: hub.icon, onHighlight: () => preload(hub.id) })), [hubs, preload]);
  if (items.length < 2) return status ?? null;
  return (
    <Box className="hub-switch">
      <WorkspaceSwitch items={items} current={current} onSelect={onSelect} label="Switch hub" />
      {status !== undefined && <Box className="hub-switch__status">{status}</Box>}
    </Box>
  );
};

export { HubSwitch };
