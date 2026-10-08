/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { BrockAppBugReport } from './bug-report.type';
import { useBugReportStore } from './useBugReportStore';

const useBugReportTransport = (bugReport: BrockAppBugReport | undefined): void => {
  useEffect(() => {
    useBugReportStore.getState().setAppTransport(bugReport ?? null);
  }, [bugReport]);
};

export { useBugReportTransport };
