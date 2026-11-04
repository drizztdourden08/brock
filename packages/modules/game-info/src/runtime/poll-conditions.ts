/* @layer renderer-shell @kind logic */
import type { GateSignal } from '../provider/signals.type';

interface PollConditions {
  coreStatus: string;
  gate: ReturnType<GateSignal['get']>;
  visible: boolean;
}

const shouldPoll = ({ coreStatus, gate, visible }: PollConditions): boolean =>
  coreStatus === 'running' && gate === null && visible;

export { shouldPoll };
export type { PollConditions };
