/* @layer renderer-shell @kind logic */
import type { BugReportExtrasSource } from './bug-report.type';
import { useBugReportStore } from './useBugReportStore';

const bugReport = {
  setExtras: (source: BugReportExtrasSource | null): void => useBugReportStore.getState().setExtras(source),
  open: (): void => useBugReportStore.getState().show(),
  close: (): void => useBugReportStore.getState().hide(),
  isOpen: (): boolean => useBugReportStore.getState().open,
};

export { bugReport };
