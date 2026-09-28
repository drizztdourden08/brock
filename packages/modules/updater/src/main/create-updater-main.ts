/* @layer electron-main @kind logic */
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import type { UpdaterMain, UpdaterOptions } from './updater-main.type';
import { createUpdater } from './create-updater';
import { registerUpdaterHandlers } from './handlers';
import { runVelopackHooks } from './run-velopack-hooks';
import { DATA_DIR, FIRST_CHECK_DELAY_MS, MODULE_ID } from './updater-main.constants';

const createUpdaterMain = (options: UpdaterOptions = {}): MainModule => {
  const { hooks = {}, firstCheckDelayMs = FIRST_CHECK_DELAY_MS } = options;
  let updater: UpdaterMain | null = null;

  return {
    id: MODULE_ID,
    dataDirs: [DATA_DIR],
    onBoot: () => runVelopackHooks(hooks),
    register: async (ctx) => {
      updater = await createUpdater(ctx, options);
      registerUpdaterHandlers(ctx, updater);
    },
    onWindow: (_win, ctx) => {
      if (!ctx.flags.isHeadlessLaunch()) updater?.scheduleFirstCheck(firstCheckDelayMs);
    },
    onWillQuit: () => updater?.dispose(),
  };
};

export { createUpdaterMain };
