/* @layer core @kind logic */
import { expansionOf } from '../../world';
import { callKey } from './call-key';
import type { HelperNode, HelperRegistry, RuleNode, World, WorldKeys } from '../../world';

const exportExpansionOf = <K extends WorldKeys>(
  node: HelperNode<K>, world: World<K>, helpers: HelperRegistry<World<K>>,
): RuleNode<K> | undefined => {
  if (helpers.get(node.name)?.expand === undefined) return undefined;
  if ((node.args ?? []).some((arg) => typeof arg === 'object')) {
    throw new Error(`derived helper called with a setting or seed argument: ${callKey(node)}`);
  }
  return expansionOf(node, world, helpers);
};

export { exportExpansionOf };
