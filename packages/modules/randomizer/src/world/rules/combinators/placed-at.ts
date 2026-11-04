/* @layer core @kind logic */
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const placedAt = <K extends WorldKeys>(location: K['location'], item: K['item']): Rule<K> =>
  compileRule<K>({ op: 'placedAt', location, item }, NO_HELPERS);

export { placedAt };
