/* @layer core @kind logic */
import { sizeOfField } from '../placement/size-of-field';
import { checkSignal } from '../signal/check-signal';
import { armedSummary } from './armed-summary';
import { armLocalRun } from './arm-local-run';
import { disarmLocalRun } from './disarm-local-run';
import { LOCAL_KIND, LOCAL_TAG, NO_REPORTED } from './local-session.constants';
import type { LocalRun } from './local-run.type';
import type { LocalSessionOptions } from './local-session-options.type';
import type { RandomizerSession, SessionStatus } from './randomizer-session.type';
import { revertApplier } from './revert-applier';

const createLocalSession = <P, A>(options: LocalSessionOptions<P, A>): RandomizerSession => {
  const { game, placement, seed, log } = options;
  let status: SessionStatus = 'idle';
  let run: LocalRun<A> | null = null;

  const session: RandomizerSession = {
    kind: LOCAL_KIND,
    get status() {
      return status;
    },
    reportCheck: (key) => {
      const current = run;
      current?.armed.onCheck(key, (request) => current.queue?.enqueue(request) ?? null);
      checkSignal.notify(game.memory.view());
    },
    reported: () => run?.poller.reported() ?? NO_REPORTED,
    start: async () => {
      status = 'starting';
      log(`${LOCAL_TAG} Starting session: seed ${seed}, ${sizeOfField(placement, 'locations')} locations`);
      const armedRun = await armLocalRun(options, session);
      if (armedRun === null) {
        status = 'error';
        return;
      }
      run = armedRun;
      log(`${LOCAL_TAG} Session armed: ${armedSummary(armedRun.armed.counts)}`);
      status = 'active';
    },
    stop: () => {
      if (run !== null) disarmLocalRun(run);
      run = null;
      void revertApplier(game, log);
      log(`${LOCAL_TAG} Session stopped`);
      status = 'idle';
    },
  };
  return session;
};

export { createLocalSession };
