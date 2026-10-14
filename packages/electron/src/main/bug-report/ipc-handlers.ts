/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { bugReportTransport } from './bug-report-transport';
import { sendBugReport } from './send-bug-report';
import { transportInfo } from './transport-info';

const bugReportHandlers: HandlerGroup = {
  id: 'bugReport',
  register: (ctx) => {
    ctx.handle('bugReport:transport', () => transportInfo(bugReportTransport.current, ctx));
    ctx.handle('bugReport:send', (_event, payload) => sendBugReport(bugReportTransport.current, payload, ctx));
  },
};

export { bugReportHandlers };
