/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { BugReportState } from './bug-report.type';

const useBugReportStore = create<BugReportState>()((set) => ({
  open: false,
  appTransport: null,
  extras: null,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  setAppTransport: (appTransport) => set({ appTransport }),
  setExtras: (extras) => set({ extras }),
}));

export { useBugReportStore };
