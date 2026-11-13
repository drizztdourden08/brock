/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { DetectedDevice } from '../../../bindings/detected/detected.type';
import { detectAllDevices } from '../../../bindings/detected/detect-all-devices';
import { useControllerDevices } from '../../../renderer/useControllerDevices';

const useDeviceSync = (extraDevices: readonly DetectedDevice[] = []) => {
  const { entries, groups: controllerGroups, isRescanPending, handleRescan, addMapping } = useControllerDevices();
  const devices = useMemo(() => {
    const detected = detectAllDevices(entries);
    const known = new Set(detected.map((d) => d.id));
    return [...detected, ...extraDevices.filter((d) => !known.has(d.id))];
  }, [entries, extraDevices]);
  const filteredDevices = useMemo(
    () => devices.filter((d) => !d.displayName.toLowerCase().includes('mouse')),
    [devices],
  );

  return { devices, filteredDevices, entries, controllerGroups, isRescanPending, handleRescan, addMapping };
};

export { useDeviceSync };
