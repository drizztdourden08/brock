/* @layer core @kind logic */
import type { ResolvedControl } from '../../family/family.type';
import type { VerbBindings } from '../bindings.type';
import { bindingForPosition } from './binding-for-position';
import type { VerbDef } from './verbs.type';

const defaultVerbBindings = (defs: readonly VerbDef[], controls: readonly ResolvedControl[]): VerbBindings => {
  const byPosition = new Map<string, ResolvedControl>(controls.map(control => [control.position, control]));
  const verbs: VerbBindings = {};
  for (const def of defs) verbs[def.id] = bindingForPosition(def.position, byPosition);
  return verbs;
};

export { defaultVerbBindings };
