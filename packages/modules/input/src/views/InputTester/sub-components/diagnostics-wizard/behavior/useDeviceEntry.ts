/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { inputApi } from '../../../../../renderer/input-api';
import type { DeviceEntry } from '../../../../../device.type';

const useDeviceEntry = (deviceKey: string | null): DeviceEntry | null => {
  const [entry, setEntry] = useState<DeviceEntry | null>(null);

  useEffect(() => {
    const api = inputApi();
    if (!deviceKey) { setEntry(null); return; }
    let cancelled = false;
    const findMatch = (list: DeviceEntry[]) => list.find((d) => d.deviceKey === deviceKey) ?? null;

    api.list().then((list) => { if (!cancelled) setEntry(findMatch(list)); }).catch(() => {});
    const unsubscribe = api.onDevices((list) => { if (!cancelled) setEntry(findMatch(list)); });

    return () => { cancelled = true; unsubscribe(); };
  }, [deviceKey]);

  return entry;
};

export { useDeviceEntry };
