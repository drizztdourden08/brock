/* @layer renderer-shell @kind logic */
import { windowGlobal } from '../host/window-global';
import type { AppLogBus } from './app-log.type';

const exposeLogGlobals = (target: AppLogBus): void => {
  windowGlobal.write('__logEntries', () => target.getEntries());
  windowGlobal.write('__logSubscribe', target.subscribe);
};

export { exposeLogGlobals };
