/* @layer renderer-shell @kind logic */
import type { ActionBinding, ButtonIcon } from '../bindings.type';
import { padHexOrNull } from '../device-keys/pad-hex-or-null';
import { resolveIconByVidPid } from './resolve-icon-by-vid-pid';

const resolveMappingIcon = (mapping: ActionBinding, liveSdlType?: string | null): ButtonIcon | null => {
  if (mapping.icon) return mapping.icon;
  if (mapping.binding.type === 'none' || mapping.binding.type === 'keyboard') return null;
  const vid = padHexOrNull(mapping.sourceVid);
  const pid = padHexOrNull(mapping.sourcePid);
  if (!vid || !pid) return null;
  return resolveIconByVidPid(vid, pid, mapping.binding, liveSdlType);
};

export { resolveMappingIcon };
