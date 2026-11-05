/* @layer renderer-shell @kind logic */
import { ALL_AXES, ALL_BUTTONS } from '../../device-profile/device-profile.constants';
import type { DeviceEntry } from '../../device.type';
import { resolveDeviceControls } from '../../family/sdl-capabilities';
import type { ResolvedControl, SdlGamepadType } from '../../family';
import { recallControllerSdlType } from '../../runtime/controller-family-cache/recall-controller-sdl-type';
import { resolveDeviceFromEntry } from '../../runtime/resolve-device';
import { padHex } from '../device-keys/pad-hex';
import type { DeviceIdentity } from './detected.type';

const entryMatches = (entry: DeviceEntry, vid: string, pid: string): boolean =>
  padHex(entry.vendorId.toString(16)) === vid &&
  padHex(entry.productId.toString(16)) === pid &&
  (entry.hasButton?.length ?? 0) > 0;

const controlsForDevice = (identity: DeviceIdentity, entries: readonly DeviceEntry[]): ResolvedControl[] => {
  const vid = padHex(identity.vid);
  const pid = padHex(identity.pid);
  if (!vid || !pid) return [];

  const entry = entries.find((candidate) => entryMatches(candidate, vid, pid));
  if (entry) return [...resolveDeviceFromEntry(entry).controls];

  const remembered = recallControllerSdlType(parseInt(vid, 16), parseInt(pid, 16));
  const sdlType = (remembered ?? identity.sdlType ?? null) as SdlGamepadType | null;
  if (!sdlType) return [];

  return resolveDeviceControls({
    sdlType,
    vendorId: vid,
    productId: pid,
    hasButton: ALL_BUTTONS,
    hasAxis: ALL_AXES,
    buttonLabels: [],
  });
};

export { controlsForDevice };
