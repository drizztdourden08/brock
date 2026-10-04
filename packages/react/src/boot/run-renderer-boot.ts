/* @layer renderer-shell @kind logic */
import type { BootProgress } from '@drizztdourden08/brock-core';
import { runBootTasks } from '@drizztdourden08/brock-core';
import { hostApi } from '../host/host-api';
import { getAppLog } from '../log/get-app-log';
import { HEARTBEAT_MS } from './boot.constants';
import type { RendererBootExtras, RendererBootTask } from './renderer-boot.type';
import { useBootStore } from './useBootStore';
import { watchSessionFills } from './watch-session-fills';

const runRendererBoot = async (tasks: readonly RendererBootTask[], extras: () => RendererBootExtras): Promise<void> => {
  const api = hostApi();
  let last: BootProgress | null = null;
  const heartbeat = setInterval(() => { if (last) api?.bootProgress(last); }, HEARTBEAT_MS);
  const stopWatch = import.meta.env.DEV ? watchSessionFills(tasks, (message) => getAppLog().log('app', message, 'warn')) : null;
  const outcome = await runBootTasks(tasks, {
    extras,
    onProgress: (progress) => {
      last = progress;
      api?.bootProgress(progress);
    },
  });
  clearInterval(heartbeat);
  stopWatch?.();
  if (outcome.ok) {
    useBootStore.getState().setPhase('ready');
    api?.bootReady();
    return;
  }
  const { failure } = outcome;
  getAppLog().error(`Boot stopped at ${failure.label}: ${failure.message}`);
  useBootStore.getState().fail(failure);
  api?.bootFailed(failure);
};

export { runRendererBoot };
