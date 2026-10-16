/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { useRoutePreloader } from '../../../../lazy/useRoutePreloader';
import { WorkspaceSwitch } from '../../../../shell/WorkspaceSwitch/WorkspaceSwitch';
import { useRegisteredHubs } from '../../behavior/useRegisteredHubs';
import type { HubSwitchProps } from './HubSwitch.type';

const HubSwitch = (props: HubSwitchProps) => {
  const { current, onSelect } = props;
  const hubs = useRegisteredHubs();
  const preload = useRoutePreloader();
  const items = useMemo(() => hubs.map((hub) => ({ id: hub.id, label: hub.title, icon: hub.icon, onHighlight: () => preload(hub.id) })), [hubs, preload]);
  if (items.length < 2) return null;
  return <WorkspaceSwitch items={items} current={current} onSelect={onSelect} label="Switch hub" />;
};

export { HubSwitch };
