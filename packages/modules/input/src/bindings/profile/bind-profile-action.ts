/* @layer core @kind logic */
import type { InputProfile } from '../input-profile.type';
import { bindMapping } from './bind-mapping';
import type { BindProfileActionParams } from './profile.type';

const bindProfileAction = ({ profile, action, binding, vid, pid }: BindProfileActionParams): InputProfile => {
  const firstIndex = profile.mappings.findIndex((mapping) => mapping.action === action);
  return {
    ...profile,
    mappings: profile.mappings
      .map((mapping, index) => (index === firstIndex ? bindMapping({ mapping, binding, vid, pid }) : mapping))
      .filter((mapping, index) => mapping.action !== action || index === firstIndex),
    modifiedAt: Date.now(),
  };
};

export { bindProfileAction };
