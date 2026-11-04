/* @layer core @kind logic */
import type { LocalRun } from './local-run.type';

const disarmLocalRun = <A>(run: LocalRun<A>): void => {
  run.stopAdopt();
  run.poller.stop();
  run.queue?.stop();
  run.queue?.clear();
  run.armed.stop?.();
};

export { disarmLocalRun };
