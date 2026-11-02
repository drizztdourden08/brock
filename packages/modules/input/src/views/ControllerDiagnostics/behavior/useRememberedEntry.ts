/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { DeviceEntry } from '../../../device.type';
import { useControllerDevicesStore } from '../../../renderer/useControllerDevicesStore';

const useRememberedEntry = (deviceKey: string | null): DeviceEntry | null => {
  const live = useControllerDevicesStore((state) => state.entries.find((entry) => entry.deviceKey === deviceKey) ?? null);
  const [kept, setKept] = useState<DeviceEntry | null>(live);

  useEffect(() => {
    if (live) setKept(live);
  }, [live]);

  return live ?? kept;
};

export { useRememberedEntry };
