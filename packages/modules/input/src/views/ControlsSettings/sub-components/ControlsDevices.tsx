/* @layer renderer-components @kind component */
import { useCallback, useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { SidePanel } from '@drizztdourden08/tessera/composites';
import { RescanButton } from '../../../compounds/RescanButton';
import { controllerGroupEntry } from '../behavior/controller-group-entry';
import { extraDeviceEntries } from '../behavior/extra-device-entries';
import { keyboardEntry } from '../behavior/keyboard-entry';
import { sideSlotClass } from '../behavior/side-slot-class';
import { useStoredFold } from '../behavior/useStoredFold';
import { DEVICES_FOLD_KEY, DEVICES_WIDTH_KEY, NO_EXTRA_DEVICES, SIDE_PANEL_SIZE } from '../ControlsSettings.constants';
import { DeviceRailButton } from './DeviceRailButton';
import { DevicesBody } from './DevicesBody';
import { NarrowPanel } from './NarrowPanel';
import type { ControlsDevicesProps } from './ControlsDevices.type';
import type { DeviceAssignInfo } from './DeviceRow.type';

const ControlsDevices = (props: ControlsDevicesProps) => {
  const { devices, controllerGroups, labels, narrow, isRescanPending, onRescan, onPreset, onAddMapping } = props;
  const extraDevices = props.extraDevices ?? NO_EXTRA_DEVICES;
  const { collapsed, toggle } = useStoredFold(DEVICES_FOLD_KEY, false);
  const entries = useMemo(() => [
    ...devices.filter((d) => d.type === 'keyboard').map((d) => keyboardEntry(d, labels)),
    ...controllerGroups.map((g) => controllerGroupEntry(g, labels)),
    ...extraDeviceEntries(extraDevices, controllerGroups, labels),
  ], [devices, controllerGroups, extraDevices, labels]);

  const handleAssign = useCallback((d: DeviceAssignInfo) => {
    if (!d.sdlType) return;
    onPreset({ sdlType: d.sdlType, deviceName: d.displayName, vid: d.vendorId ?? '', pid: d.productId ?? '' });
  }, [onPreset]);

  const rail = entries.map((entry) => <DeviceRailButton key={entry.key} entry={entry} onAssign={handleAssign} />);

  const action = <RescanButton isPending={isRescanPending} onRescan={onRescan} />;
  const body = <DevicesBody entries={entries} labels={labels} onAssign={handleAssign} onAddMapping={onAddMapping} />;
  if (narrow) return <NarrowPanel action={action}>{body}</NarrowPanel>;

  return (
    <Box className={sideSlotClass('end', collapsed)}>
      <SidePanel
        side="end"
        title={labels.devicesTitle}
        {...SIDE_PANEL_SIZE}
        storageKey={DEVICES_WIDTH_KEY}
        action={action}
        railItems={rail}
        collapsed={collapsed}
        onCollapsedChange={toggle}
        containers={[{ title: labels.connectedDevices, content: body }]}
      />
    </Box>
  );
};

export { ControlsDevices };
