/* @layer renderer-components @kind logic */
import { UNBOUND } from '../../../bindings/bindings.constants';
import type { ActionBinding, ButtonIcon } from '../../../bindings/bindings.type';
import { findLiveDevice } from '../../../bindings/detected/find-live-device';
import { padHexOrNull } from '../../../bindings/device-keys/pad-hex-or-null';
import { resolveIconByVidPid } from '../../../bindings/icons/resolve-icon-by-vid-pid';
import type { ActionRow, ActionRowParams } from './controls-behavior.type';
import { liveDeviceIcon } from './live-device-icon';

const storedIcon = (mapping: ActionBinding): ButtonIcon | null => (mapping.icon?.key ? mapping.icon : null);

const actionRow = ({ action, mapping, mappingIndex, multiController, devices }: ActionRowParams): ActionRow => {
  if (!mapping) return { action, mappingIndex, binding: UNBOUND, icon: null, deviceIconUrl: null };
  const { binding } = mapping;
  if (binding.type === 'none' || binding.type === 'keyboard') {
    return { action, mappingIndex, binding, icon: null, deviceIconUrl: null };
  }
  const stored = storedIcon(mapping);
  const vid = padHexOrNull(mapping.sourceVid);
  const pid = padHexOrNull(mapping.sourcePid);
  if (!vid || !pid) return { action, mappingIndex, binding, icon: stored, deviceIconUrl: null };

  const liveSdlType = findLiveDevice(vid, pid, devices)?.sdlType;
  return {
    action,
    mappingIndex,
    binding,
    icon: resolveIconByVidPid(vid, pid, binding, liveSdlType) ?? stored,
    deviceIconUrl: multiController ? liveDeviceIcon(vid, pid, devices) : null,
  };
};

export { actionRow };
