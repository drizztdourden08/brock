/* @layer renderer-components @kind logic */
import type { DetectedDevice } from '../../../bindings/detected/detected.type';
import { findLiveDevice } from '../../../bindings/detected/find-live-device';
import { buildDisplayContext, resolveBrandLogoKey } from '../../../family';
import { recallControllerSdlType } from '../../../runtime/controller-family-cache/recall-controller-sdl-type';
import { GENERIC_ICON_FAMILY } from '../ControlsSettings.constants';
import { deviceIconUrl } from './device-icon-url';

/** Controller art for a vendor and product pair, from the cached SDL type or the live family. */
const liveDeviceIcon = (vid: string, pid: string, devices: readonly DetectedDevice[]): string | null => {
  const sdlType = recallControllerSdlType(parseInt(vid, 16), parseInt(pid, 16));
  const family = sdlType
    ? (resolveBrandLogoKey(buildDisplayContext({ sdlType })) || GENERIC_ICON_FAMILY)
    : (findLiveDevice(vid, pid, devices)?.deviceFamily ?? GENERIC_ICON_FAMILY);
  return deviceIconUrl({ sdlType, family });
};

export { liveDeviceIcon };
