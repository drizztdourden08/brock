/* @layer core @kind logic */
import { checkSignal } from '../signal/check-signal';
import { ONLINE_TAG } from './online-session.constants';
import type { OnlineParts } from './online-parts.type';

const reportOnlineCheck = <P, A>({ ap, game, run, log, late }: OnlineParts<P, A>, key: string): void => {
  log(`${ONLINE_TAG} Check completed: ${key}`);
  run.reportedAll.add(key);
  const client = late.client();
  if (key === ap.goal?.key) {
    run.goalDone = true;
    client.reportGoal();
  }
  const id = ap.locationIdOf(key);
  if (id !== null) client.reportCheck(id);
  checkSignal.notify(game.memory.view());
};

export { reportOnlineCheck };
