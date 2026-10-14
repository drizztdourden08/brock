/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { BugReportTransportInfo } from '@drizztdourden08/brock-core';
import { useProduct } from '../app/useProduct';
import { hostApi } from '../host/host-api';
import type { BugReportTarget } from './bug-report.type';
import { resolveBugReportTarget } from './resolve-bug-report-target';
import { useBugReportStore } from './useBugReportStore';

const askMain = async (): Promise<BugReportTransportInfo | null> => {
  const api = hostApi();
  if (!api || typeof api.getBugReportTransport !== 'function') return null;
  return api.getBugReportTransport().catch(() => null);
};

const useBugReportTarget = (open: boolean): BugReportTarget | null => {
  const { repo } = useProduct();
  const app = useBugReportStore((s) => s.appTransport);
  const [target, setTarget] = useState<BugReportTarget | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    let live = true;
    void (app ? Promise.resolve(null) : askMain()).then((main) => {
      if (!live) return;
      const api = hostApi();
      setTarget(resolveBugReportTarget({ app, main, sendToMain: api ? (payload) => api.sendBugReport(payload) : null, repo }));
    });
    return () => { live = false; };
  }, [open, app, repo]);

  return open ? target : null;
};

export { useBugReportTarget };
