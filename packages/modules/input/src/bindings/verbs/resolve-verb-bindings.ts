/* @layer core @kind logic */
import type { VerbBindings } from '../bindings.type';
import { defaultVerbBindings } from './default-verb-bindings';
import { keyboardVerbBindings } from './keyboard-verb-bindings';
import type { VerbDef, VerbSource } from './verbs.type';

const baseVerbBindings = (defs: readonly VerbDef[], source: VerbSource): VerbBindings => {
  if (source.keyboard) return keyboardVerbBindings(defs);
  return defaultVerbBindings(defs, source.controls ?? []);
};

const resolveVerbBindings = (defs: readonly VerbDef[], source: VerbSource): VerbBindings => {
  const base = baseVerbBindings(defs, source);
  if (!source.stored) return base;
  const verbs: VerbBindings = {};
  for (const def of defs) {
    const binding = source.stored[def.id] ?? base[def.id];
    if (binding) verbs[def.id] = binding;
  }
  return verbs;
};

export { resolveVerbBindings };
