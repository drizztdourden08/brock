/* @layer electron-main @kind logic */
import { runBootTasks } from '@drizztdourden08/brock-core/boot';
import type { MainContext } from '../types/main-context.type';
import { logBootTask } from '../bootstrap/log-boot-task';
import type { MainBootTask } from './boot-state.type';
import { bootState } from './boot-state';
import { relayProgress } from './relay-progress';
import { reportBootFailure } from './report-boot-failure';
import { bootTimeout } from './boot-timeout';
import { tryReveal } from './try-reveal';

const runMainBoot = async (tasks: readonly MainBootTask[], ctx: MainContext): Promise<void> => {
  const outcome = await runBootTasks(tasks, {
    extras: () => ctx,
    defaultTimeoutMs: bootTimeout(ctx.flags).ms,
    onProgress: (progress) => {
      bootState.main = progress;
      bootState.lastSide = 'main';
      relayProgress();
    },
    onTaskEvent: (event) => logBootTask('main', event),
  });
  if (!outcome.ok) {
    reportBootFailure({ ...outcome.failure, side: 'main' });
    return;
  }
  bootState.mainDone = true;
  tryReveal();
};

export { runMainBoot };
