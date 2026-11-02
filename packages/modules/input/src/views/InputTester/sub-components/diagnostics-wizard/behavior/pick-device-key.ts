/* @layer renderer-shell @kind logic */
import type { ChooserDevice } from '../diagnostics-wizard.type';

const pickDeviceKey = (chooserDevices: readonly ChooserDevice[], initialDeviceKey: string | null | undefined, strict: boolean): string | null => {
  if (initialDeviceKey && chooserDevices.some((d) => d.deviceKey === initialDeviceKey)) return initialDeviceKey;
  if (strict) return null;
  return chooserDevices[0]?.deviceKey ?? null;
};

export { pickDeviceKey };
