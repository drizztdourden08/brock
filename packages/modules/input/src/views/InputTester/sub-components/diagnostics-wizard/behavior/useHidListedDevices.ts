/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { inputApi } from '../../../../../renderer/input-api';
import type { HidListedDevice } from '../../../../../device.type';

const useHidListedDevices = (active: boolean): HidListedDevice[] => {
  const [devices, setDevices] = useState<HidListedDevice[]>([]);

  useEffect(() => {
    const api = inputApi();
    if (!active) return;
    let cancelled = false;
    api.listHid().then((list) => { if (!cancelled) setDevices(list); }).catch(() => {});
    return () => { cancelled = true; };
  }, [active]);

  return devices;
};

export { useHidListedDevices };
