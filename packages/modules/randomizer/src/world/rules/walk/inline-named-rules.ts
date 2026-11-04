/* @layer core @kind logic */
import { expansionOf } from './expansion-of';
import type { HelperRegistry } from '../../types/helper-registry.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const inlineNamedRules = <K extends WorldKeys>(
  node: RuleNode<K>, world: World<K>, helpers: HelperRegistry<World<K>>,
): RuleNode<K> => {
  if (node.op === 'all' || node.op === 'any') {
    return { op: node.op, of: node.of.map((child) => inlineNamedRules(child, world, helpers)) };
  }
  if (node.op === 'if') {
    return {
      op: 'if',
      cond: inlineNamedRules(node.cond, world, helpers),
      then: inlineNamedRules(node.then, world, helpers),
      else: inlineNamedRules(node.else, world, helpers),
    };
  }
  if (node.op === 'helper') {
    const expansion = expansionOf(node, world, helpers);
    return expansion === undefined ? node : inlineNamedRules(expansion, world, helpers);
  }
  return node;
};

export { inlineNamedRules };
