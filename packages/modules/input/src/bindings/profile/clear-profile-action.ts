/* @layer core @kind logic */
import { UNBOUND } from '../bindings.constants';
import type { InputProfile } from '../input-profile.type';
import { bindProfileAction } from './bind-profile-action';
import type { ClearProfileActionParams } from './profile.type';

const clearProfileAction = ({ profile, action, mappingIndex }: ClearProfileActionParams): InputProfile => {
  const sharesAction = profile.mappings.filter((mapping) => mapping.action === action).length > 1;
  if (!sharesAction) return bindProfileAction({ profile, action, binding: UNBOUND, vid: null, pid: null });
  return {
    ...profile,
    mappings: profile.mappings.filter((_, index) => index !== mappingIndex),
    modifiedAt: Date.now(),
  };
};

export { clearProfileAction };
