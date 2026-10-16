/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { BugReportState } from './bug-report.type';

const useBugReportStore = create<BugReportState>()((set) => ({
  open: false,
  prefill: null,
  appTransport: null,
  extras: null,
  show: (options) => set(typeof options?.title === 'string' ? { open: true, prefill: options.title } : { open: true }),
  hide: () => set({ open: false, prefill: null }),
  setPrefill: (prefill) => set({ prefill }),
  setAppTransport: (appTransport) => set({ appTransport }),
  setExtras: (extras) => set({ extras }),
}));

export { useBugReportStore };
