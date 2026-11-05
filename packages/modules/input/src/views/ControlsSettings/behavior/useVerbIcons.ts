/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { ButtonIcon } from '../../../bindings';
import { findLiveDevice } from '../../../bindings/detected/find-live-device';
import { padHex } from '../../../bindings/device-keys/pad-hex';
import { resolveIconByVidPid } from '../../../bindings/icons/resolve-icon-by-vid-pid';
import type { UseVerbIconsArgs } from '../ControlsBehavior.type';

const useVerbIcons = ({ activeProfile, devices, verbBindings }: UseVerbIconsArgs) =>
  useMemo(() => {
    const assigned = activeProfile?.assignedDevice;
    const icons: Partial<Record<string, ButtonIcon | null>> = {};
    if (!assigned?.vendorId || !assigned.productId) return icons;

    const vid = padHex(assigned.vendorId);
    const pid = padHex(assigned.productId);
    const liveSdlType = findLiveDevice(vid, pid, devices)?.sdlType;
    for (const [verbId, binding] of Object.entries(verbBindings)) {
      if (binding.type === 'none' || binding.type === 'keyboard') continue;
      icons[verbId] = resolveIconByVidPid(vid, pid, binding, liveSdlType);
    }
    return icons;
  }, [activeProfile, devices, verbBindings]);

export { useVerbIcons };
