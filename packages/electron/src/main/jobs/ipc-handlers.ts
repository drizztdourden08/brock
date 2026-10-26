/* @layer electron-main @kind logic */
import { fromAppFrame } from '../ipc/from-app-frame';
import type { HandlerGroup } from '../types/main-context.type';

const jobHandlers: HandlerGroup = {
  id: 'jobs',
  register: ({ handle, on, jobs, processes }) => {
    handle('job:list', () => jobs.list());
    handle('job:runProcess', (event, id, args) => processes.start(id, args, ({ anyWindow }) => fromAppFrame(event, { anyWindow })));
    on('job:cancel', (_event, id) => jobs.cancel(id));
    on('job:dismiss', (_event, id) => jobs.dismiss(id));
  },
};

export { jobHandlers };
