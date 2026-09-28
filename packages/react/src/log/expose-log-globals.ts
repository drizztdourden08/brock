/* @layer renderer-shell @kind logic */
import type { AppLogBus, LogGlobals } from './app-log.type';

const exposeLogGlobals = (target: AppLogBus): void => {
  const globals = window as LogGlobals;
  globals.__logEntries = () => target.getEntries();
  globals.__logSubscribe = target.subscribe;
};

export { exposeLogGlobals };
