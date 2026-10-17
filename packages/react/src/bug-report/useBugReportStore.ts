/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { BugReportState } from './bug-report.type';

const useBugReportStore = create<BugReportState>()((set) => ({
  open: false,
  prefill: null,
  prefillIsDefault: false,
  appTransport: null,
  extras: null,
  show: (options) => set(typeof options?.title === 'string' ? { open: true, prefill: options.title, prefillIsDefault: false } : { open: true }),
  hide: () => set({ open: false, prefill: null, prefillIsDefault: false }),
  setPrefill: (prefill) => set({ prefill, prefillIsDefault: prefill !== null }),
  setAppTransport: (appTransport) => set({ appTransport }),
  setExtras: (extras) => set({ extras }),
}));

export { useBugReportStore };
