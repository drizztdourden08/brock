/* @layer core @kind logic */
import type { VerbBindings } from '../bindings.type';
import type { InputProfile } from '../input-profile.type';

const profileWithVerbs = (profile: InputProfile, verbs: VerbBindings): InputProfile => ({
  ...profile,
  verbs,
  modifiedAt: Date.now(),
});

export { profileWithVerbs };
