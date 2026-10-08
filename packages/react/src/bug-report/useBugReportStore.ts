/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { BugReportState } from './bug-report.type';

const useBugReportStore = create<BugReportState>()((set) => ({
  open: false,
  appTransport: null,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  setAppTransport: (appTransport) => set({ appTransport }),
}));

export { useBugReportStore };
