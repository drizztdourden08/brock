/* @layer core @kind logic */
import { when } from '../build';
import { ruleOf } from '../compile';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const either = <K extends WorldKeys>(condition: Rule<K>, whenTrue: Rule<K>, whenFalse: Rule<K>): Rule<K> =>
  ruleOf(
    when(condition.node, whenTrue.node, whenFalse.node),
    (state) => (condition(state) ? whenTrue(state) : whenFalse(state)),
  );

export { either };
