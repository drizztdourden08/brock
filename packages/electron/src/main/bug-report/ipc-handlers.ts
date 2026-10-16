/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { bugReportTransport } from './bug-report-transport';
import { receiptWire } from './receipt-wire';
import { retryBugReport } from './retry-bug-report';
import { sendBugReport } from './send-bug-report';
import { transportInfo } from './transport-info';

const bugReportHandlers: HandlerGroup = {
  id: 'bugReport',
  register: (ctx) => {
    ctx.handle('bugReport:transport', () => transportInfo(bugReportTransport.current, ctx));
    ctx.handle('bugReport:send', async (_event, payload) => receiptWire(await sendBugReport(bugReportTransport.current, payload, ctx)));
    ctx.handle('bugReport:retry', (_event, retryId) => retryBugReport(retryId, ctx));
  },
};

export { bugReportHandlers };
