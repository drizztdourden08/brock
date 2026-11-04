/* @layer core @kind logic */
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import type { Rule } from '../../types/rule.type';
import type { WorldKeys } from '../../types/world-keys.type';

const exitRule = <K extends WorldKeys>(name: string): Rule<K> => compileRule<K>({ op: 'exit', name }, NO_HELPERS);

export { exitRule };
