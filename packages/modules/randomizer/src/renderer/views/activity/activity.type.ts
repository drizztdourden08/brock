/* @layer renderer-shell @kind types */
import type { LogRule } from '../../../contract/randomizer-views.type';

type ActivityClass = Pick<LogRule, 'kind' | 'tag'>;

export type { ActivityClass };
