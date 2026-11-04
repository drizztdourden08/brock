/* @layer core @kind logic */
import { all } from '../build';
import { ruleOf } from '../compile';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const allOf = <K extends WorldKeys>(...rules: readonly Rule<K>[]): Rule<K> =>
  ruleOf(all(...rules.map((rule) => rule.node)), (state) => rules.every((rule) => rule(state)));

export { allOf };
