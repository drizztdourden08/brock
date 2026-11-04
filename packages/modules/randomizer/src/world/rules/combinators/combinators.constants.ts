/* @layer core @kind constants */
import { compileRule } from '../compile';
import { NO_HELPERS } from '../no-helpers.constants';
import { FALSE, TRUE } from '../build';
import type { Rule } from '../../types/rule.type';

const always: Rule = compileRule(TRUE, NO_HELPERS);

const never: Rule = compileRule(FALSE, NO_HELPERS);

export { always, never };
