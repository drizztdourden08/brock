/* @layer renderer-shell @kind types */
import type { GateSignal } from '../provider/signals.type';

interface PollConditions {
  coreStatus: string;
  gate: ReturnType<GateSignal['get']>;
  visible: boolean;
}

export type { PollConditions };
