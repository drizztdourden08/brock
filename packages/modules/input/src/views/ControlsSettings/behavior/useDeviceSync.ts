/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import { detectAllDevices } from '../../../bindings/detected/detect-all-devices';
import { useControllerDevices } from '../../../renderer/useControllerDevices';

const useDeviceSync = () => {
  const { entries, groups: controllerGroups, isRescanPending, handleRescan, addMapping } = useControllerDevices();
  const devices = useMemo(() => detectAllDevices(entries), [entries]);
  const filteredDevices = useMemo(
    () => devices.filter((d) => !d.displayName.toLowerCase().includes('mouse')),
    [devices],
  );

  return { devices, filteredDevices, entries, controllerGroups, isRescanPending, handleRescan, addMapping };
};

export { useDeviceSync };
