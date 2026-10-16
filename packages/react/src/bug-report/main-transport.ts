/* @layer renderer-shell @kind logic */
import type { BugReportReceipt, BugReportReceiptWire, BugReportTransport, Result } from '@drizztdourden08/brock-core';
import type { ReportApi } from './main-transport.type';

const fromWire = (api: ReportApi, result: Result<BugReportReceiptWire>): Result<BugReportReceipt> => {
  if (!result.success) return result;
  const { retryId, ...receipt } = result.value;
  if (retryId === undefined) return { success: true, value: receipt };
  return { success: true, value: { ...receipt, retry: () => api.retryBugReport(retryId).then((next) => fromWire(api, next)) } };
};

const mainTransport = (api: ReportApi): BugReportTransport => (payload) => api.sendBugReport(payload).then((result) => fromWire(api, result));

export { mainTransport };
