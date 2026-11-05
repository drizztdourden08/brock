/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../../device.type';
import type { ResolvedControl } from '../../family';
import type { InputProfile } from '../input-profile.type';
import { controlsForDevice } from './controls-for-device';

const controlsForProfile = (profile: InputProfile | null, entries: readonly DeviceEntry[]): ResolvedControl[] => {
  if (!profile || profile.deviceType === 'keyboard') return [];
  const assigned = profile.assignedDevice;
  if (!assigned?.vendorId || !assigned.productId) return [];
  return controlsForDevice({ vid: assigned.vendorId, pid: assigned.productId }, entries);
};

export { controlsForProfile };
