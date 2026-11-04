/* @layer core @kind logic */
import type { Rule } from '../../types/rule.type';
import type { RuleCheck } from '../../types/rule-check.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const ruleOf = <K extends WorldKeys>(node: RuleNode<K>, check: RuleCheck<World<K>>): Rule<K> =>
  Object.assign(check, { node });

export { ruleOf };
