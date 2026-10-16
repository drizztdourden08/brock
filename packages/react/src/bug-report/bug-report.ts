/* @layer renderer-shell @kind logic */
import type { BugReportExtrasSource, BugReportOpenOptions } from './bug-report.type';
import { useBugReportStore } from './useBugReportStore';

const bugReport = {
  setExtras: (source: BugReportExtrasSource | null): void => useBugReportStore.getState().setExtras(source),
  setDefaultTitle: (title: string | null): void => useBugReportStore.getState().setPrefill(title),
  open: (options?: BugReportOpenOptions): void => useBugReportStore.getState().show(options),
  close: (): void => useBugReportStore.getState().hide(),
  isOpen: (): boolean => useBugReportStore.getState().open,
};

export { bugReport };
