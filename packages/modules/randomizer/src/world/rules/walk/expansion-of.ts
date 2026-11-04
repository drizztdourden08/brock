/* @layer core @kind logic */
import { isPlainArg } from '../is-plain-arg';
import type { HelperNode } from '../../types/helper-node.type';
import type { HelperRegistry } from '../../types/helper-registry.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const expansionOf = <K extends WorldKeys>(
  node: HelperNode<K>, world: World<K>, helpers: HelperRegistry<World<K>>,
): RuleNode<K> | undefined => {
  const definition = helpers.get(node.name);
  const args = node.args ?? [];
  const plain = args.filter(isPlainArg);
  if (definition?.expand === undefined || plain.length !== args.length) return undefined;
  return definition.expand(world, ...plain);
};

export { expansionOf };
