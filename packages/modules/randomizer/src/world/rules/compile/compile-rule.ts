/* @layer core @kind logic */
import { compileCheck } from './compile-check';
import { ruleOf } from './rule-of';
import type { HelperRegistry } from '../../types/helper-registry.type';
import type { Rule } from '../../types/rule.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const compileRule = <K extends WorldKeys>(node: RuleNode<K>, helpers: HelperRegistry<World<K>>): Rule<K> =>
  ruleOf(node, compileCheck(node, helpers));

export { compileRule };
