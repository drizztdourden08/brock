/* @layer renderer-shell @kind logic */
import type { LogEntry } from '@drizztdourden08/brock-core';
import type { LogRule } from '../../../contract/randomizer-views.type';
import { ERROR_CLASS, INFO_CLASS, WARN_CLASS } from './activity-rules.constants';
import type { ActivityClass } from './activity.type';

const classifyEntry = (entry: LogEntry, rules: readonly LogRule[]): ActivityClass => {
  if (entry.level === 'error' || entry.channel === 'error') return ERROR_CLASS;
  if (entry.level === 'warn') return WARN_CLASS;
  return rules.find((rule) => rule.pattern.test(entry.message)) ?? INFO_CLASS;
};

export { classifyEntry };
