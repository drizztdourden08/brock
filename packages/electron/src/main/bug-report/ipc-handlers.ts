/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { DEFAULT_SEND_LABEL } from './bug-report.constants';
import { bugReportTransport } from './bug-report-transport';
import { sendBugReport } from './send-bug-report';

const bugReportHandlers: HandlerGroup = {
  id: 'bugReport',
  register: (ctx) => {
    ctx.handle('bugReport:transport', () => {
      const options = bugReportTransport.current;
      return options ? { label: options.label ?? DEFAULT_SEND_LABEL } : null;
    });
    ctx.handle('bugReport:send', (_event, payload) => sendBugReport(bugReportTransport.current, payload, ctx));
  },
};

export { bugReportHandlers };
