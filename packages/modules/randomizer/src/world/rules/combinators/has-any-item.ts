/* @layer core @kind logic */
import { hasAny } from '../build';
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const hasAnyItem = <K extends WorldKeys>(items: readonly K['holding'][]): Rule<K> =>
  compileRule<K>(hasAny<K>(items), NO_HELPERS);

export { hasAnyItem };
