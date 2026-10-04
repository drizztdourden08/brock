/* @layer renderer-shell @kind logic */
import type { BootTask } from '@drizztdourden08/brock-core';
import { sessionResetWatch } from '../stores/session-reset-watch';
import { tasksBeforeSettings } from './tasks-before-settings';

const fillWarning = (filled: number, suspects: readonly string[]): string => {
  const stores = filled === 1 ? '1 session store' : `${filled} session stores`;
  const who = suspects.length > 0 ? ` Boot tasks that can run before it: ${suspects.join(', ')}.` : '';
  return `The profile hydration reset ${stores} filled before the profile loaded, so that data is gone.${who} A renderer boot task that fills a session store must run after: ['settings'].`;
};

const watchSessionFills = (tasks: readonly Pick<BootTask, 'id' | 'after'>[], warn: (message: string) => void): () => void => {
  const suspects = tasksBeforeSettings(tasks);
  sessionResetWatch.listener = (filled) => warn(fillWarning(filled, suspects));
  return () => { sessionResetWatch.listener = null; };
};

export { watchSessionFills };
