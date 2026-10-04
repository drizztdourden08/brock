/* @layer renderer-shell @kind logic */
import { getAppLog } from '../log/get-app-log';
import type { BeforeQuit, QuitGuardRegistry } from './quit.type';

const guards = new Set<BeforeQuit>();

const ask = (guard: BeforeQuit): string[] => {
  try {
    const message = guard();
    return message ? [message] : [];
  } catch (error) {
    getAppLog().error(`beforeQuit threw: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};

const quitGuards: QuitGuardRegistry = {
  add: (guard) => {
    guards.add(guard);
    return () => { guards.delete(guard); };
  },
  messages: () => [...guards].flatMap(ask),
};

export { quitGuards };
