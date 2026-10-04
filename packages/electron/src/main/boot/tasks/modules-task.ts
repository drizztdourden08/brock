/* @layer electron-main @kind logic */
import type { BootstrapOptions } from '../../types/main-context.type';
import { baseHandlers } from '../../bootstrap/base-handlers';
import { registerHandlerGroups } from '../../bootstrap/register-handlers';
import type { MainBootTask } from '../boot-state.type';

const modulesTask = (options: BootstrapOptions): MainBootTask => ({
  id: 'modules',
  label: 'Starting modules',
  run: async (ctx) => {
    const modules = options.modules ?? [];
    registerHandlerGroups(baseHandlers(), ctx);
    for (const [index, module] of modules.entries()) {
      ctx.report(index / (modules.length + 1), module.id);
      await module.register(ctx);
    }
    registerHandlerGroups(options.handlers ?? [], ctx);
    await options.onReady?.(ctx);
  },
});

export { modulesTask };
