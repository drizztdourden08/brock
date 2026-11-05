/* @layer core @kind logic */
import { UNBOUND } from '../bindings.constants';
import type { VerbBindings } from '../bindings.type';
import type { VerbDef } from './verbs.type';

const keyboardVerbBindings = (defs: readonly VerbDef[]): VerbBindings => {
  const verbs: VerbBindings = {};
  for (const def of defs) verbs[def.id] = def.keyboard ?? UNBOUND;
  return verbs;
};

export { keyboardVerbBindings };
