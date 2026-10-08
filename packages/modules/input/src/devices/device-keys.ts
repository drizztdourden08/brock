/* @layer core @kind logic */
import type { AssignedKey, DeviceKeys } from './device-keys.type';
import { toVidPid } from './vid-pid';

const firstFreeSlot = (used: ReadonlySet<number>): number => {
  let slot = 1;
  while (used.has(slot)) slot += 1;
  return slot;
};

const createDeviceKeys = (): DeviceKeys => {
  const byId = new Map<number, AssignedKey>();
  const usedSlots = new Map<string, Set<number>>();

  const assign = (sdlId: number, vendorId: number, productId: number): string => {
    const vidPid = toVidPid(vendorId, productId);
    const used = usedSlots.get(vidPid) ?? new Set<number>();
    const slot = firstFreeSlot(used);
    used.add(slot);
    usedSlots.set(vidPid, used);
    const deviceKey = slot === 1 ? vidPid : `${vidPid}#${slot}`;
    byId.set(sdlId, { deviceKey, vidPid, slot });
    return deviceKey;
  };

  const release = (sdlId: number): string | undefined => {
    const entry = byId.get(sdlId);
    if (!entry) return undefined;
    byId.delete(sdlId);
    const used = usedSlots.get(entry.vidPid);
    used?.delete(entry.slot);
    if (used?.size === 0) usedSlots.delete(entry.vidPid);
    return entry.deviceKey;
  };

  const keyFor = (sdlId: number): string | undefined => byId.get(sdlId)?.deviceKey;

  return { assign, release, keyFor };
};

export { createDeviceKeys };
