/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { HandlerGroup, MainContext } from '../types/main-context.type';

const registered = new Set<string>();

const registerHandlerGroups = (groups: readonly HandlerGroup[], ctx: MainContext): void => {
  for (const group of groups) {
    if (group.devOnly && app.isPackaged) continue;
    if (registered.has(group.id)) {
      ctx.log(`handler group "${group.id}" is already registered; skipped`, 'warn');
      continue;
    }
    registered.add(group.id);
    group.register(ctx);
  }
};

export { registerHandlerGroups };
