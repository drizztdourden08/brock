/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { collectProcesses } from './collect-processes';
import { collectSystemDiagnostics } from './collect-system-diagnostics';

const diagnosticsHandlers: HandlerGroup = {
  id: 'diagnostics',
  register: ({ handle }) => {
    handle('diagnostics:getSystem', () => collectSystemDiagnostics());
    handle('diagnostics:getProcesses', () => collectProcesses());
  },
};

export { diagnosticsHandlers };
