/* @layer electron-main @kind logic */
import { runBootTasks } from '@drizztdourden08/brock-core/boot';
import type { MainContext } from '../types/main-context.type';
import { logBoot } from '../bootstrap/boot-timing';
import type { MainBootTask } from './boot-state.type';
import { bootState } from './boot-state';
import { relayProgress } from './relay-progress';
import { reportBootFailure } from './report-boot-failure';
import { tryReveal } from './try-reveal';

const runMainBoot = async (tasks: readonly MainBootTask[], ctx: MainContext): Promise<void> => {
  const outcome = await runBootTasks(tasks, {
    extras: () => ctx,
    onProgress: (progress) => {
      bootState.main = progress;
      bootState.lastSide = 'main';
      relayProgress();
    },
    onTaskDone: (id) => logBoot(`main task ${id}`),
  });
  if (!outcome.ok) {
    reportBootFailure({ ...outcome.failure, side: 'main' });
    return;
  }
  bootState.mainDone = true;
  tryReveal();
};

export { runMainBoot };
