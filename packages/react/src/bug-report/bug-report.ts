/* @layer renderer-shell @kind logic */
import { useBugReportStore } from './useBugReportStore';

const bugReport = {
  open: (): void => useBugReportStore.getState().show(),
  close: (): void => useBugReportStore.getState().hide(),
  isOpen: (): boolean => useBugReportStore.getState().open,
};

export { bugReport };
