/* @layer core @kind logic */
import { region } from '../build';
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const canReach = <K extends WorldKeys>(id: K['region']): Rule<K> => compileRule<K>(region<K>(id), NO_HELPERS);

export { canReach };
