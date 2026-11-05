/* @layer core @kind logic */
import { UNBOUND } from '../bindings.constants';
import type { ActionBinding } from '../bindings.type';
import { sameGamepadInput } from '../device-keys/same-gamepad-input';
import { bindMapping } from './bind-mapping';
import type { BindGlobalActionParams } from './profile.type';

const bindGlobalAction = ({ mappings, action, binding, vid, pid }: BindGlobalActionParams): ActionBinding[] =>
  mappings.map((mapping) => {
    if (mapping.action === action) return bindMapping({ mapping, binding, vid, pid });
    if (sameGamepadInput(mapping.binding, binding)) {
      return bindMapping({ mapping, binding: UNBOUND, vid: null, pid: null });
    }
    return mapping;
  });

export { bindGlobalAction };
