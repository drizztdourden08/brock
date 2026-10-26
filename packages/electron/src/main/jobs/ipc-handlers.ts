/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';

const jobHandlers: HandlerGroup = {
  id: 'jobs',
  register: ({ handle, on, jobs, processes }) => {
    handle('job:list', () => jobs.list());
    handle('job:runProcess', (_event, id, args) => processes.start(id, args));
    on('job:cancel', (_event, id) => jobs.cancel(id));
    on('job:dismiss', (_event, id) => jobs.dismiss(id));
  },
};

export { jobHandlers };
