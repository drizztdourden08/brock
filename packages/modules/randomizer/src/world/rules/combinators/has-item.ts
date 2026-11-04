/* @layer core @kind logic */
import { has } from '../build';
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const hasItem = <K extends WorldKeys>(item: K['holding'], count = 1): Rule<K> =>
  compileRule<K>(has<K>(item, count), NO_HELPERS);

export { hasItem };
