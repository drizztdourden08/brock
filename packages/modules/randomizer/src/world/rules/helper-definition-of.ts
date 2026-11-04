/* @layer core @kind logic */
import type { HelperDefinition } from '../types/helper-definition.type';
import type { HelperRegistry } from '../types/helper-registry.type';
import type { KeysOf } from '../types/keys-of.type';
import type { World } from '../types/world.type';

const helperDefinitionOf = <W extends World>(
  helpers: HelperRegistry<W>, name: KeysOf<W>['helper'],
): HelperDefinition<W> => {
  const definition = helpers.get(name);
  if (definition === undefined) throw new Error(`unknown rule helper: ${name}`);
  return definition;
};

export { helperDefinitionOf };
