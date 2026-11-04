/* @layer core @kind logic */
import { any } from '../build';
import { ruleOf } from '../compile';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const anyOf = <K extends WorldKeys>(...rules: readonly Rule<K>[]): Rule<K> =>
  ruleOf(any(...rules.map((rule) => rule.node)), (state) => rules.some((rule) => rule(state)));

export { anyOf };
