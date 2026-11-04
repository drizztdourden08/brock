/* @layer core @kind logic */
import { helper } from '../build';
import { compileRule } from '../compile';
import type { HelperRegistry } from '../../types/helper-registry.type';
import type { Rule } from '../../types/rule.type';
import type { RuleArg } from '../../types/rule-arg.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const helperRule = <K extends WorldKeys>(
  helpers: HelperRegistry<World<K>>, name: K['helper'], ...args: readonly RuleArg<K>[]
): Rule<K> => compileRule<K>(helper<K>(name, ...args), helpers);

export { helperRule };
