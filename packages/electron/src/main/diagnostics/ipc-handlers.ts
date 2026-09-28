/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { collectSystemDiagnostics } from './collect-system-diagnostics';

const diagnosticsHandlers: HandlerGroup = {
  id: 'diagnostics',
  register: ({ handle }) => {
    handle('diagnostics:getSystem', () => collectSystemDiagnostics());
  },
};

export { diagnosticsHandlers };
