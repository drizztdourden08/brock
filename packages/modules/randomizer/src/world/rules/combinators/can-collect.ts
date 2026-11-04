/* @layer core @kind logic */
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const canCollect = <K extends WorldKeys>(location: K['location']): Rule<K> =>
  compileRule<K>({ op: 'location', location }, NO_HELPERS);

export { canCollect };
