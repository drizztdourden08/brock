/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';

const jobHandlers: HandlerGroup = {
  id: 'jobs',
  register: ({ handle, on, jobs }) => {
    handle('job:list', () => jobs.list());
    on('job:cancel', (_event, id) => jobs.cancel(id));
    on('job:dismiss', (_event, id) => jobs.dismiss(id));
  },
};

export { jobHandlers };
