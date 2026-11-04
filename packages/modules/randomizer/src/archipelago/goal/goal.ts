/* @layer core @kind logic */
import type { ApClientPacket } from '../protocol/client-packets.type';
import { CLIENT_GOAL } from './goal.constants';
import type { GoalReporter } from './goal.type';

const createGoalReporter = (send: (packet: ApClientPacket) => void): GoalReporter => {
  let reached = false;
  const sendGoal = (): void => send({ cmd: 'StatusUpdate', status: CLIENT_GOAL });
  return {
    get reached() {
      return reached;
    },
    report() {
      if (reached) return;
      reached = true;
      sendGoal();
    },
    onConnected() {
      if (reached) sendGoal();
    },
  };
};

export { createGoalReporter };
