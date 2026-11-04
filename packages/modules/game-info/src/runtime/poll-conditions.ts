/* @layer renderer-shell @kind logic */
import type { PollConditions } from './poll-conditions.type';

const shouldPoll = ({ coreStatus, gate, visible }: PollConditions): boolean =>
  coreStatus === 'running' && gate === null && visible;

export { shouldPoll };
